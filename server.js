import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { exec, spawn } from "child_process";
import AdmZip from "adm-zip";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Set up upload storage
const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
const upload = multer({ dest: tempDir });

// Store active job logs
const activeJobs = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// SSE endpoint to stream logs for a job
app.get("/api/logs/:jobId", (req, res) => {
  const { jobId } = req.params;
  
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });

  const job = activeJobs.get(jobId);
  if (!job) {
    res.write(`data: ${JSON.stringify({ type: "error", message: "Job not found" })}\n\n`);
    res.end();
    return;
  }

  // Send history logs
  job.logs.forEach(log => {
    res.write(`data: ${JSON.stringify(log)}\n\n`);
  });

  // Listener for new logs
  const logListener = (log) => {
    res.write(`data: ${JSON.stringify(log)}\n\n`);
    if (log.type === "success" || log.type === "error") {
      res.end();
      activeJobs.delete(jobId);
    }
  };

  job.listeners.push(logListener);

  req.on("close", () => {
    if (activeJobs.has(jobId)) {
      const j = activeJobs.get(jobId);
      j.listeners = j.listeners.filter(l => l !== logListener);
    }
  });
});

// Trigger upload and deployment process
app.post("/api/deploy", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const jobId = Math.random().toString(36).substring(2, 15);
  const surgeEmail = req.body.email || "jobiq-navigator-2026@temp.org";
  const surgePassword = req.body.password || "JobIQNavPass2026";
  const surgeDomain = req.body.domain || ""; // will let surge generate one if empty

  activeJobs.set(jobId, {
    logs: [],
    listeners: []
  });

  // Start processing in background
  processDeployment(jobId, req.file.path, { email: surgeEmail, password: surgePassword, domain: surgeDomain });

  res.json({ jobId });
});

// Main process pipeline
async function processDeployment(jobId, zipPath, options) {
  const log = (message, type = "info") => {
    const job = activeJobs.get(jobId);
    if (!job) return;
    const logItem = { message, type, time: new Date().toLocaleTimeString() };
    job.logs.push(logItem);
    job.listeners.forEach(listener => listener(logItem));
  };

  const workDir = path.join(__dirname, "temp", `work-${jobId}`);

  try {
    log("Extracting ZIP file...");
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(workDir, true);
    log("Extraction complete.");

    // 1. Run Decoupling Cleanup
    log("Cleaning up Lovable references...");
    decoupleProject(workDir, log);

    // 2. Install dependencies using Node 22 to satisfy TanStack Start & Rolldown engines
    log("Installing dependencies via npm (using Node 22.12.0)...");
    await runCommand("npx -p node@22.12.0 npm install", workDir, log);

    // If on Linux, explicitly install the rolldown native binding using Node 22 to bypass the npm v10 optional dependency bug
    if (process.platform === "linux") {
      log("Installing native bindings for Linux x64 (using Node 22.12.0)...");
      try {
        await runCommand("npx -p node@22.12.0 npm install --save-optional @rolldown/binding-linux-x64-gnu", workDir, log);
      } catch (e) {
        log(`Warning: Failed to install optional native bindings: ${e.message}`);
      }
    }

    // 3. Build the project using Node 22
    log("Building the project for production (using Node 22.12.0)...");
    await runCommand("npx -p node@22.12.0 npm run build", workDir, log);

    // 4. Detect deploy directory
    let deployDir = path.join(workDir, "dist", "client");
    if (!fs.existsSync(deployDir)) {
      deployDir = path.join(workDir, "dist");
    }
    if (!fs.existsSync(deployDir)) {
      deployDir = path.join(workDir, "build");
    }
    if (!fs.existsSync(deployDir)) {
      deployDir = path.join(workDir, "out");
    }
    if (!fs.existsSync(deployDir)) {
      deployDir = workDir; // Fallback to root
    }
    log(`Detected deploy directory: ${path.relative(workDir, deployDir) || "."}`);

    // 5. Deploy to Surge using interactive spawn to supply credentials
    log("Deploying to Surge.sh...");
    const deployOutput = await runSurgeDeploy(deployDir, options.domain, options.email, options.password, log);

    // Find the published domain from surge output
    const match = deployOutput.match(/Success! - Published to ([\w.-]+)/);
    const domain = match ? match[1] : options.domain;

    if (domain) {
      log(`Successfully published permanently to: http://${domain}`, "success");
    } else {
      log("Deployment completed, but could not parse the Surge URL.", "success");
    }

  } catch (error) {
    log(`Deployment failed: ${error.message}`, "error");
  } finally {
    // Clean up temporary files
    try {
      if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
      if (fs.existsSync(workDir)) fs.rmSync(workDir, { recursive: true, force: true });
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }
}

// Cleanup function to remove Lovable files and references
function decoupleProject(dir, log) {
  // A. Delete proprietary folders/files
  const pathsToDelete = [
    path.join(dir, ".lovable"),
    path.join(dir, "bun.lock"),
    path.join(dir, "bunfig.toml"),
    path.join(dir, "AGENTS.md"),
    path.join(dir, "src", "lib", "lovable-error-reporting.ts")
  ];

  pathsToDelete.forEach(p => {
    if (fs.existsSync(p)) {
      const relativePath = path.relative(dir, p);
      fs.rmSync(p, { recursive: true, force: true });
      log(`Deleted: ${relativePath}`);
    }
  });

  // B. Clean package.json
  const pkgPath = path.join(dir, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      let updated = false;

      if (pkg.devDependencies && pkg.devDependencies["@lovable.dev/vite-tanstack-config"]) {
        delete pkg.devDependencies["@lovable.dev/vite-tanstack-config"];
        updated = true;
      }
      if (pkg.dependencies && pkg.dependencies["@lovable.dev/vite-tanstack-config"]) {
        delete pkg.dependencies["@lovable.dev/vite-tanstack-config"];
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8");
        log("Removed '@lovable.dev/vite-tanstack-config' from package.json");
      }
    } catch (e) {
      log(`Error updating package.json: ${e.message}`);
    }
  }

  // C. Replace vite.config.ts
  const viteConfigPath = path.join(dir, "vite.config.ts");
  if (fs.existsSync(viteConfigPath)) {
    const configContent = fs.readFileSync(viteConfigPath, "utf8");
    if (configContent.includes("@lovable.dev/vite-tanstack-config")) {
      const newConfig = `import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
      prerender: {
        enabled: true,
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
});
`;
      fs.writeFileSync(viteConfigPath, newConfig, "utf8");
      log("Migrated vite.config.ts to standard Vite configuration (with prerendering enabled)");
    }
  }

  // D. Clean src/routes/__root.tsx
  const rootRoutePath = path.join(dir, "src", "routes", "__root.tsx");
  if (fs.existsSync(rootRoutePath)) {
    try {
      let rootContent = fs.readFileSync(rootRoutePath, "utf8");
      let updated = false;

      // Remove import
      if (rootContent.includes('import { reportLovableError } from "../lib/lovable-error-reporting";')) {
        rootContent = rootContent.replace('import { reportLovableError } from "../lib/lovable-error-reporting";', "");
        updated = true;
      }
      
      // Remove useEffect call in ErrorComponent
      const errorEffectRegex = /useEffect\(\s*\(\)\s*=>\s*\{\s*reportLovableError\([^)]*\);\s*\}\s*,\s*\[error\]\s*\);?/g;
      if (errorEffectRegex.test(rootContent)) {
        rootContent = rootContent.replace(errorEffectRegex, "");
        updated = true;
      }

      // Remove lovable.app metadata images
      const lovableImageRegex = /\{\s*(property|name):\s*"(og:image|twitter:image)"[\s\S]*?lovable\.app[\s\S]*?\},\s*/g;
      if (lovableImageRegex.test(rootContent)) {
        rootContent = rootContent.replace(lovableImageRegex, "");
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(rootRoutePath, rootContent, "utf8");
        log("Cleaned Lovable error reporting and preview metadata from __root.tsx");
      }
    } catch (e) {
      log(`Error cleaning __root.tsx: ${e.message}`);
    }
  }

  // E. Fix crashed asset JSON images
  const assetsDir = path.join(dir, "src", "assets");
  if (fs.existsSync(assetsDir)) {
    try {
      const files = fs.readdirSync(assetsDir);
      files.forEach(file => {
        if (file.endsWith(".asset.json")) {
          const filePath = path.join(assetsDir, file);
          const assetData = JSON.parse(fs.readFileSync(filePath, "utf8"));
          if (assetData.url && assetData.url.includes("/__l5e/assets-v1/")) {
            // Point to local favicon.ico as a safe fallback logo
            assetData.url = "/favicon.ico";
            fs.writeFileSync(filePath, JSON.stringify(assetData, null, 2), "utf8");
            log(`Redirected crashed lovable asset link in: src/assets/${file}`);
          }
        }
      });
    } catch (e) {
      log(`Error fixing assets: ${e.message}`);
    }
  }
}

function runCommand(command, cwd, log) {
  return new Promise((resolve, reject) => {
    // Force Node to prefer IPv4 when resolving localhost to bypass IPv6 connection refuse bugs in sandboxes
    const child = exec(command, { 
      cwd,
      env: {
        ...process.env,
        NODE_OPTIONS: "--dns-result-order=ipv4first"
      }
    });
    let stdoutData = "";

    child.stdout.on("data", (data) => {
      stdoutData += data;
      const lines = data.trim().split("\n");
      lines.forEach(line => {
        if (line.trim()) log(line.trim());
      });
    });

    child.stderr.on("data", (data) => {
      const lines = data.trim().split("\n");
      lines.forEach(line => {
        if (line.trim()) log(`[Warn/Stderr] ${line.trim()}`);
      });
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdoutData);
      } else {
        reject(new Error(`Command '${command}' exited with code ${code}`));
      }
    });
  });
}

// Helper to run interactive Surge deployments using child process spawn
function runSurgeDeploy(deployDir, domain, email, password, log) {
  return new Promise((resolve, reject) => {
    log(`Starting Surge deployment process for domain: ${domain || "random"}...`);
    
    const domainArg = domain ? [domain] : [];
    const args = ["-p", "node@22.12.0", "-p", "surge", "surge", deployDir, ...domainArg];
    
    // Force Node to prefer IPv4 when resolving localhost to bypass IPv6 connection refuse bugs
    const env = {
      ...process.env,
      NODE_OPTIONS: "--dns-result-order=ipv4first"
    };

    const child = spawn("npx", args, { env });
    let stdoutData = "";
    let stderrData = "";
    let domainConfirmed = false;

    child.stdout.on("data", (data) => {
      const output = data.toString();
      stdoutData += output;
      
      // Log output to frontend console
      const lines = output.trim().split("\n");
      lines.forEach(line => {
        if (line.trim()) log(line.trim());
      });

      // Handle interactive email prompt
      if (output.includes("email:")) {
        log(`[Surge CLI] Inputting email: ${email}`);
        child.stdin.write(email + "\n");
      }
      
      // Handle interactive password prompt
      if (output.includes("password:")) {
        log("[Surge CLI] Inputting password...");
        child.stdin.write(password + "\n");
      }

      // Handle interactive domain confirmation prompt (once only)
      if (output.includes("domain:") && !domainConfirmed) {
        domainConfirmed = true;
        log("[Surge CLI] Confirming domain...");
        child.stdin.write("\n");
      }
    });

    child.stderr.on("data", (data) => {
      const output = data.toString();
      stderrData += output;
      const lines = output.trim().split("\n");
      lines.forEach(line => {
        if (line.trim()) log(`[Warn/Stderr] ${line.trim()}`);
      });
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdoutData);
      } else {
        reject(new Error(`Surge deployment failed with exit code ${code}.`));
      }
    });
  });
}

// Global error handling middleware to prevent HTML error pages on failure
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
