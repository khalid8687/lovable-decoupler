// ============================================================
// Deploy client
//
// Two modes, chosen automatically:
//   1. Backend mode  - when served by server.js (Render / local),
//                      it calls our /api/* endpoints and needs no token.
//   2. Static mode   - when hosted on a static host (e.g. Surge),
//                      it talks to GitHub directly using a token you
//                      paste ONCE; it is stored in your browser only
//                      and is never embedded in this file.
// ============================================================

// Optional backend base URL ("" = same origin).
const API_BASE =
  (typeof window !== "undefined" && window.LOVABLE_API_BASE) ||
  (typeof localStorage !== "undefined" && localStorage.getItem("lovable_api_base")) ||
  "";

const GITHUB_OWNER = "khalid8687";
const GITHUB_REPO  = "lovable-decoupler";
const TOKEN_KEY    = "lovable_gh_token";

let backendAvailable = false;

function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; }
}
function saveToken(t) {
  try { localStorage.setItem(TOKEN_KEY, t); } catch (e) { /* ignore */ }
}
function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* ignore */ }
}

function ghHeaders(token, withBody) {
  const h = {
    "Authorization": "Bearer " + token,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (withBody) h["Content-Type"] = "application/json";
  return h;
}

// Detect whether a backend is serving us.
async function detectBackend() {
  try {
    const res = await fetch(API_BASE + "/api/health", { cache: "no-store" });
    if (!res.ok) return false;
    const data = await res.json();
    return !!(data && data.ok);
  } catch (e) {
    return false;
  }
}

// In static mode we need a GitHub token. Ask for it once, keep it locally.
function ensureToken() {
  if (backendAvailable) return true;
  if (getToken()) return true;
  const t = window.prompt(
    "الصق توكن GitHub مرة واحدة (هيتحفظ في متصفحك بس ومش هيظهر لحد).\n" +
    "من: GitHub → Settings → Developer settings → Personal access tokens\n\n" +
    "مثال: ghp_xxxxxxxx"
  );
  if (!t || !t.trim()) return false;
  saveToken(t.trim());
  return true;
}

// DOM Elements
const dropZone         = document.getElementById("drop-zone");
const fileInput        = document.getElementById("file-input");
const fileBadge        = document.getElementById("file-badge");
const fileNameEl       = document.getElementById("file-name");
const removeFileBtn    = document.getElementById("remove-file");
const submitBtn        = document.getElementById("submit-btn");
const deployForm       = document.getElementById("deploy-form");
const terminalCard     = document.getElementById("terminal-card");
const logConsole       = document.getElementById("log-console");
const statusBadge      = document.getElementById("status-badge");
const resultCard       = document.getElementById("result-card");
const resultLink       = document.getElementById("result-link");
const resultCopyBtn    = document.getElementById("result-copy-btn");
const resultRestartBtn = document.getElementById("result-restart-btn");

let selectedFile = null;
let pollInterval = null;

// Drag & Drop
dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", e => { e.preventDefault(); dropZone.classList.add("drag-over"); });
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file && file.name.endsWith(".zip")) setFile(file);
});
fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) setFile(fileInput.files[0]);
});
removeFileBtn.addEventListener("click", e => { e.stopPropagation(); clearFile(); });

function setFile(file) {
  selectedFile = file;
  fileNameEl.textContent = file.name;
  fileBadge.style.display = "flex";
  dropZone.classList.add("has-file");
  submitBtn.disabled = false;
}

function clearFile() {
  selectedFile = null;
  fileInput.value = "";
  fileBadge.style.display = "none";
  dropZone.classList.remove("has-file");
  submitBtn.disabled = true;
}

// Logging
function appendLog(message, type = "info") {
  const line = document.createElement("div");
  line.className = `log-line ${type}`;
  const time = new Date().toLocaleTimeString();
  line.innerHTML = `<span class="log-time">[${time}]</span> ${escapeHtml(message)}`;
  logConsole.appendChild(line);
  logConsole.scrollTop = logConsole.scrollHeight;
}

function escapeHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function setStatus(text, type) {
  statusBadge.textContent = text;
  statusBadge.className = "status-badge " + (type || "");
}

// Submit
deployForm.addEventListener("submit", async e => {
  e.preventDefault();
  if (!selectedFile) return;

  // Figure out which mode we're in and make sure we have what we need.
  submitBtn.disabled = true;
  backendAvailable = await detectBackend();
  if (!ensureToken()) {
    submitBtn.disabled = false;
    alert("محتاج توكن GitHub عشان يشتغل. اعمله من GitHub → Settings → Developer settings → Tokens.");
    return;
  }

  deployForm.parentElement.style.display = "none";
  terminalCard.style.display = "block";
  resultCard.style.display   = "none";
  logConsole.innerHTML       = "";
  setStatus("Processing", "");

  appendLog(backendAvailable
    ? "Connected to server backend. Uploading ZIP..."
    : "Static mode. Uploading ZIP to GitHub (secure temporary storage)...");

  try {
    // Step 1: Upload ZIP
    const zipUrl = await uploadToGitHub(selectedFile);
    appendLog("Upload complete. Secure URL obtained.");

    // Step 2: Trigger the deploy workflow
    const runToken = Math.random().toString(36).substring(2, 12);
    appendLog("Triggering GitHub Actions deployment pipeline...");
    await triggerDeploy(zipUrl, runToken);
    appendLog("Workflow triggered! Waiting for GitHub to start the runner...");
    setStatus("Building", "building");

    await sleep(8000);
    appendLog("Runner started. Build + deploy in progress (usually 2-4 minutes)...");
    appendLog("Steps: Extract → Clean Lovable → Install → Build → Surge Deploy");

    startPolling(runToken);

  } catch (err) {
    appendLog("Error: " + err.message, "error");
    setStatus("Failed", "failed");
    submitBtn.disabled = false;
  }
});

// Upload ZIP (via backend if available, otherwise straight to GitHub)
async function uploadToGitHub(file) {
  if (backendAvailable) {
    appendLog("Encoding ZIP for upload...");
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(API_BASE + "/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      let msg = String(res.status);
      try { const d = await res.json(); if (d && d.error) msg = d.error; } catch (e) {}
      throw new Error("GitHub upload failed: " + msg);
    }
    const data = await res.json();
    if (!data.zipUrl) throw new Error("GitHub upload failed: no URL returned by the server");
    return data.zipUrl;
  }

  // Static mode: direct to GitHub with the browser-stored token.
  const token = getToken();
  appendLog("Encoding ZIP for upload...");
  const base64Content = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const filePath = "uploads/upload-" + Date.now() + ".zip";
  const apiUrl = "https://api.github.com/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO + "/contents/" + filePath;

  appendLog("Pushing ZIP to GitHub uploads branch...");
  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: ghHeaders(token, true),
    body: JSON.stringify({
      message: "Temporary upload " + Date.now(),
      content: base64Content,
      branch: "uploads"
    })
  });

  if (!res.ok) {
    const err = await res.text();
    if (res.status === 401) {
      clearToken();
      throw new Error("التوكن غلط أو منتهي الصلاحية — هيتطلب منك تدخله تاني في المحاولة الجاية.");
    }
    throw new Error("GitHub upload failed: " + res.status + " " + err.substring(0, 200));
  }

  return "https://raw.githubusercontent.com/" + GITHUB_OWNER + "/" + GITHUB_REPO + "/uploads/" + filePath;
}

// Trigger the deploy workflow (via backend if available, otherwise direct)
async function triggerDeploy(zipUrl, runToken) {
  if (backendAvailable) {
    const res = await fetch(API_BASE + "/api/dispatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zipUrl, runToken })
    });
    if (!res.ok) {
      let msg = String(res.status);
      try { const d = await res.json(); if (d && d.error) msg = d.error; } catch (e) {}
      throw new Error("Failed to trigger deploy: " + msg);
    }
    return;
  }

  const token = getToken();
  const res = await fetch("https://api.github.com/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO + "/dispatches", {
    method: "POST",
    headers: ghHeaders(token, true),
    body: JSON.stringify({
      event_type: "deploy",
      client_payload: { zip_url: zipUrl, run_token: runToken }
    })
  });

  if (res.status !== 204) {
    const body = await res.text();
    throw new Error("Failed to trigger deploy: " + res.status + " - " + body.substring(0, 200));
  }
}

// Check once for the deploy result; returns the URL or null.
async function checkResult(runToken) {
  if (backendAvailable) {
    const res = await fetch(API_BASE + "/api/result/" + encodeURIComponent(runToken), { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.ready && data.url ? data.url : null;
  }

  const url = "https://raw.githubusercontent.com/" + GITHUB_OWNER + "/" + GITHUB_REPO +
              "/results/result-" + runToken + ".txt?t=" + Date.now();
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const text = (await res.text()).trim();
  return text || null;
}

// Poll for the result written to the results branch
function startPolling(runToken) {
  let elapsed = 0;
  const maxWait = 8 * 60 * 1000;

  pollInterval = setInterval(async () => {
    elapsed += 5000;

    if (elapsed > maxWait) {
      clearInterval(pollInterval);
      appendLog("Timeout: build took too long. Check GitHub Actions.", "error");
      setStatus("Timeout", "failed");
      return;
    }

    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timeStr = minutes > 0 ? minutes + "m " + seconds + "s" : seconds + "s";

    try {
      const surgeUrl = await checkResult(runToken);
      if (surgeUrl) {
        clearInterval(pollInterval);
        appendLog("Build complete after " + timeStr + "!", "success");
        appendLog("Successfully published permanently to: " + surgeUrl, "success");
        setStatus("Success \u2713", "success");
        showSuccess(surgeUrl);
        return;
      }

      if (elapsed % 30000 === 0) {
        appendLog("Still building... " + timeStr + " elapsed. GitHub Actions is working...");
      }
    } catch (e) {
      // Network error - keep trying silently
    }
  }, 5000);
}

// Show success result card
function showSuccess(url) {
  resultCard.style.display = "block";
  resultLink.href = url;
  resultLink.textContent = url;
  resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Copy button
resultCopyBtn.addEventListener("click", () => {
  const url = resultLink.textContent;
  navigator.clipboard.writeText(url).then(() => {
    const original = resultCopyBtn.textContent;
    resultCopyBtn.textContent = "Copied!";
    resultCopyBtn.classList.add("copied");
    setTimeout(() => {
      resultCopyBtn.textContent = original;
      resultCopyBtn.classList.remove("copied");
    }, 2000);
  });
});

// Restart
resultRestartBtn.addEventListener("click", () => {
  clearFile();
  clearInterval(pollInterval);
  deployForm.parentElement.style.display = "block";
  terminalCard.style.display  = "none";
  resultCard.style.display    = "none";
  logConsole.innerHTML        = '<div class="log-line system">Waiting for process initiation...</div>';
  setStatus("Processing", "");
});

// Utility
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
