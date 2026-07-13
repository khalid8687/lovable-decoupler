document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  const fileBadge = document.getElementById("file-badge");
  const fileNameSpan = document.getElementById("file-name");
  const removeFileBtn = document.getElementById("remove-file");
  const submitBtn = document.getElementById("submit-btn");
  const deployForm = document.getElementById("deploy-form");
  
  const terminalCard = document.getElementById("terminal-card");
  const logConsole = document.getElementById("log-console");
  const statusBadge = document.getElementById("status-badge");
  
  const successCard = document.getElementById("success-card");
  const deployLink = document.getElementById("deploy-link");
  const copyBtn = document.getElementById("copy-btn");
  const restartBtn = document.getElementById("restart-btn");

  const resultCard = document.getElementById("result-card");
  const resultLink = document.getElementById("result-link");
  const resultCopyBtn = document.getElementById("result-copy-btn");
  const resultRestartBtn = document.getElementById("result-restart-btn");

  let selectedFile = null;

  // Handle Drag & Drop
  ["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    }, false);
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
    }, false);
  });

  dropZone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0 && files[0].name.endsWith(".zip")) {
      handleFileSelect(files[0]);
    }
  });

  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    if (fileInput.files.length > 0) {
      handleFileSelect(fileInput.files[0]);
    }
  });

  function handleFileSelect(file) {
    selectedFile = file;
    fileNameSpan.textContent = file.name;
    fileBadge.style.display = "inline-flex";
    submitBtn.disabled = false;
  }

  removeFileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedFile = null;
    fileInput.value = "";
    fileBadge.style.display = "none";
    submitBtn.disabled = true;
  });

  // Handle Form Submission
  deployForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    // Build Form Data
    const formData = new FormData();
    formData.append("file", selectedFile);

    // Update UI states
    deployForm.parentElement.style.display = "none";
    terminalCard.style.display = "block";
    logConsole.innerHTML = '<div class="log-line system">Uploading zip file and preparing server environment...</div>';
    statusBadge.textContent = "Uploading";
    statusBadge.className = "status-badge";

    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const { jobId } = await response.json();
      startLogStream(jobId);
    } catch (err) {
      appendLog(`Failed to start deployment: ${err.message}`, "error");
      statusBadge.textContent = "Failed";
      statusBadge.style.borderColor = "#ef4444";
      statusBadge.style.color = "#ef4444";
      statusBadge.style.background = "rgba(239, 68, 68, 0.1)";
    }
  });

  // Listen to Server Sent Events
  function startLogStream(jobId) {
    statusBadge.textContent = "Processing";
    const eventSource = new EventSource(`/api/logs/${jobId}`);

    eventSource.onmessage = (event) => {
      const logItem = JSON.parse(event.data);
      appendLog(logItem.message, logItem.type);

      if (logItem.type === "success") {
        eventSource.close();
        statusBadge.textContent = "Success";
        statusBadge.style.borderColor = "#10b981";
        statusBadge.style.color = "#10b981";
        statusBadge.style.background = "rgba(16, 185, 129, 0.1)";
        
        // Extract Surge URL from log (supports both http and https)
        const urlMatch = logItem.message.match(/https?:\/\/([\w.-]+)/);
        const url = urlMatch ? urlMatch[0] : "#";
        
        setTimeout(() => {
          showSuccess(url);
        }, 1500);
      }

      if (logItem.type === "error") {
        eventSource.close();
        statusBadge.textContent = "Failed";
        statusBadge.style.borderColor = "#ef4444";
        statusBadge.style.color = "#ef4444";
        statusBadge.style.background = "rgba(239, 68, 68, 0.1)";
      }
    };

    eventSource.onerror = () => {
      appendLog("Connection lost to server log stream.", "error");
      eventSource.close();
    };
  }

  function appendLog(message, type) {
    const line = document.createElement("div");
    line.className = `log-line ${type}`;
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logConsole.appendChild(line);
    logConsole.scrollTop = logConsole.scrollHeight;
  }

  function showSuccess(url) {
    // Keep terminal visible, but update result card directly underneath
    resultLink.href = url;
    resultLink.textContent = url;
    resultCard.style.display = "block";
    
    // Smooth scroll down to show the result card fully
    setTimeout(() => {
      resultCard.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  }

  // Copy Link to Clipboard
  copyBtn.addEventListener("click", () => {
    const urlText = deployLink.textContent;
    navigator.clipboard.writeText(urlText).then(() => {
      copyBtn.textContent = "Copied!";
      copyBtn.style.background = "#10b981";
      setTimeout(() => {
        copyBtn.textContent = "Copy Link";
        copyBtn.style.background = "var(--primary)";
      }, 2000);
    });
  });

  // Restart Flow
  restartBtn.addEventListener("click", () => {
    successCard.style.display = "none";
    deployForm.parentElement.style.display = "block";
    
    // Reset file selection
    selectedFile = null;
    fileInput.value = "";
    fileBadge.style.display = "none";
    submitBtn.disabled = true;
    deployForm.reset();
  });

  // Copy Link to Clipboard for Result Card
  resultCopyBtn.addEventListener("click", () => {
    const urlText = resultLink.textContent;
    navigator.clipboard.writeText(urlText).then(() => {
      resultCopyBtn.textContent = "Copied!";
      resultCopyBtn.style.background = "#10b981";
      resultCopyBtn.style.borderColor = "#10b981";
      resultCopyBtn.style.color = "white";
      setTimeout(() => {
        resultCopyBtn.textContent = "Copy Link";
        resultCopyBtn.style.background = "rgba(168, 85, 247, 0.2)";
        resultCopyBtn.style.borderColor = "var(--primary)";
        resultCopyBtn.style.color = "var(--fg)";
      }, 2000);
    });
  });

  // Restart Flow from Result Card
  resultRestartBtn.addEventListener("click", () => {
    resultCard.style.display = "none";
    terminalCard.style.display = "none";
    deployForm.parentElement.style.display = "block";
    
    // Reset file selection
    selectedFile = null;
    fileInput.value = "";
    fileBadge.style.display = "none";
    submitBtn.disabled = true;
    deployForm.reset();
  });
});
