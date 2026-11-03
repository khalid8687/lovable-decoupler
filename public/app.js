// ============================================================
// Deploy client — talks only to our own backend (/api/*).
// The GitHub token lives on the server (GITHUB_TOKEN env var)
// and is never embedded in this public file.
// ============================================================

// Base URL of the backend that proxies GitHub.
//   ""  -> same origin (default; works when this page is served
//          by server.js, e.g. on Render or locally).
// You can point a statically-hosted copy of this page at a remote
// backend by setting window.LOVABLE_API_BASE or
// localStorage.lovable_api_base to e.g. "https://your-app.onrender.com".
const API_BASE =
  (typeof window !== "undefined" && window.LOVABLE_API_BASE) ||
  (typeof localStorage !== "undefined" && localStorage.getItem("lovable_api_base")) ||
  "";

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

  deployForm.parentElement.style.display = "none";
  terminalCard.style.display = "block";
  resultCard.style.display   = "none";
  logConsole.innerHTML       = "";
  setStatus("Processing", "");

  appendLog("Uploading ZIP to GitHub (secure temporary storage)...");

  try {
    // Step 1: Upload ZIP to GitHub uploads branch
    const zipUrl = await uploadToGitHub(selectedFile);
    appendLog("Upload complete. Secure URL obtained.");

    // Step 2: Trigger via repository_dispatch (bypasses workflow_dispatch validation)
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
  }
});

// Upload ZIP to our backend, which forwards it to GitHub's uploads branch
async function uploadToGitHub(file) {
  appendLog("Encoding ZIP for upload...");

  const formData = new FormData();
  formData.append("file", file);

  appendLog("Uploading ZIP to the server...");
  const res = await fetch(API_BASE + "/api/upload", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    let msg = String(res.status);
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch (e) { /* ignore */ }
    throw new Error("GitHub upload failed: " + msg);
  }

  const data = await res.json();
  if (!data.zipUrl) {
    throw new Error("GitHub upload failed: no URL returned by the server");
  }
  return data.zipUrl;
}

// Ask our backend to trigger the deploy workflow (repository_dispatch)
async function triggerDeploy(zipUrl, runToken) {
  const res = await fetch(API_BASE + "/api/dispatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ zipUrl, runToken })
  });

  if (!res.ok) {
    let msg = String(res.status);
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch (e) { /* ignore */ }
    throw new Error("Failed to trigger deploy: " + msg);
  }
}

// Poll for result written to results branch
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
      const res = await fetch(API_BASE + "/api/result/" + encodeURIComponent(runToken), { cache: "no-store" });

      if (res.ok) {
        const data = await res.json();
        if (data.ready && data.url) {
          const surgeUrl = data.url;
          clearInterval(pollInterval);
          appendLog("Build complete after " + timeStr + "!", "success");
          appendLog("Successfully published permanently to: " + surgeUrl, "success");
          setStatus("Success \u2713", "success");
          showSuccess(surgeUrl);
          return;
        }
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
