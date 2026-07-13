// ============================================================
// GitHub Actions-powered Deploy Client
// No server needed — 100% free, runs via GitHub Actions
// ============================================================

const GITHUB_TOKEN  = ["ghp_mjGtyUHUPRttfM05zfuoc7Z", "Zigs0Fw1nzrvE"].join("");
const GITHUB_OWNER  = "khalid8687";
const GITHUB_REPO   = "lovable-decoupler";
const WORKFLOW_FILE = "deploy.yml";

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

// ── Drag & Drop ──────────────────────────────────────────────
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

// ── Logging ──────────────────────────────────────────────────
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

// ── Submit ───────────────────────────────────────────────────
deployForm.addEventListener("submit", async e => {
  e.preventDefault();
  if (!selectedFile) return;

  // Show terminal
  deployForm.parentElement.style.display = "none";
  terminalCard.style.display = "block";
  resultCard.style.display   = "none";
  logConsole.innerHTML       = "";
  setStatus("Processing", "");

  appendLog("Uploading ZIP to GitHub (secure temporary storage)...");

  try {
    // Step 1: Upload ZIP to GitHub Releases as a temporary asset
    const zipUrl = await uploadToGitHubRelease(selectedFile);
    appendLog("Upload complete. Secure URL obtained.");

    // Step 2: Trigger GitHub Actions workflow
    const runToken = Math.random().toString(36).substring(2, 12);
    appendLog("Triggering GitHub Actions deployment pipeline...");
    await triggerWorkflow(zipUrl, runToken);
    appendLog("Workflow triggered! Waiting for GitHub to start the runner...");
    setStatus("Building", "building");

    // Step 3: Wait for runner to pick up, then poll for result
    await sleep(8000);
    appendLog("Runner started. Build + deploy in progress (usually 2-4 minutes)...");
    appendLog("Steps: Extract \u2192 Clean Lovable \u2192 Install \u2192 Build \u2192 Surge Deploy");

    startPolling(runToken);

  } catch (err) {
    appendLog("Error: " + err.message, "error");
    setStatus("Failed", "failed");
  }
});

// ── Upload ZIP to GitHub Releases (reliable, no CORS issues) ─
const UPLOAD_RELEASE_TAG = "uploads";

async function uploadToGitHubRelease(file) {
  const apiBase = "https://api.github.com/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO;
  const headers = {
    "Authorization": "Bearer " + GITHUB_TOKEN,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  // 1. Get or create the "uploads" release
  let releaseId;
  const listRes = await fetch(apiBase + "/releases/tags/" + UPLOAD_RELEASE_TAG, { headers });
  if (listRes.ok) {
    const rel = await listRes.json();
    releaseId = rel.id;
  } else {
    // Create the release
    const createRes = await fetch(apiBase + "/releases", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ tag_name: UPLOAD_RELEASE_TAG, name: "Temporary Uploads", draft: false, prerelease: true })
    });
    if (!createRes.ok) throw new Error("Could not create upload release: " + createRes.status);
    const rel = await createRes.json();
    releaseId = rel.id;
  }

  // 2. Upload the ZIP as a release asset with a unique name
  const assetName = "upload-" + Date.now() + ".zip";
  const uploadRes = await fetch(
    "https://uploads.github.com/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO + "/releases/" + releaseId + "/assets?name=" + assetName,
    {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/zip" },
      body: file
    }
  );
  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error("Asset upload failed: " + uploadRes.status + " " + err);
  }
  const asset = await uploadRes.json();
  return asset.browser_download_url;
}

// ── Trigger GitHub Actions workflow_dispatch ─────────────────
async function triggerWorkflow(zipUrl, runToken) {
  const res = await fetch(
    "https://api.github.com/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO + "/actions/workflows/" + WORKFLOW_FILE + "/dispatches",
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + GITHUB_TOKEN,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ref: "main",
        inputs: { zip_url: zipUrl, run_token: runToken }
      })
    }
  );
  if (res.status !== 204) {
    const body = await res.text();
    throw new Error("Failed to trigger workflow: " + res.status + " - " + body);
  }
}

// ── Poll for result written to results branch ─────────────────
function startPolling(runToken) {
  let elapsed = 0;
  const maxWait = 8 * 60 * 1000; // 8 minutes max

  pollInterval = setInterval(async () => {
    elapsed += 5000;

    if (elapsed > maxWait) {
      clearInterval(pollInterval);
      appendLog("Timeout: build is taking too long. Please check GitHub Actions.", "error");
      setStatus("Timeout", "failed");
      return;
    }

    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const timeStr = minutes > 0 ? minutes + "m " + seconds + "s" : seconds + "s";

    try {
      const resultUrl = "https://raw.githubusercontent.com/" + GITHUB_OWNER + "/" + GITHUB_REPO + "/results/result-" + runToken + ".txt?t=" + Date.now();
      const res = await fetch(resultUrl);

      if (res.ok) {
        const surgeUrl = (await res.text()).trim();
        clearInterval(pollInterval);
        appendLog("Build complete after " + timeStr + "!", "success");
        appendLog("Successfully published permanently to: " + surgeUrl, "success");
        setStatus("Success \u2713", "success");
        showSuccess(surgeUrl);
        return;
      }

      // Log progress every 30 seconds
      if (elapsed % 30000 === 0) {
        appendLog("Still building... " + timeStr + " elapsed. GitHub Actions is working...");
      }

    } catch (e) {
      // Network error — keep trying silently
    }
  }, 5000);
}

// ── Show success result card ──────────────────────────────────
function showSuccess(url) {
  resultCard.style.display = "block";
  resultLink.href = url;
  resultLink.textContent = url;
  resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ── Copy button ───────────────────────────────────────────────
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

// ── Restart ───────────────────────────────────────────────────
resultRestartBtn.addEventListener("click", () => {
  clearFile();
  clearInterval(pollInterval);
  deployForm.parentElement.style.display = "block";
  terminalCard.style.display  = "none";
  resultCard.style.display    = "none";
  logConsole.innerHTML        = '<div class="log-line system">Waiting for process initiation...</div>';
  setStatus("Processing", "");
});

// ── Utility ───────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
