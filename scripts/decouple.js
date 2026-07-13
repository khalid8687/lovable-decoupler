import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const projectDir = process.argv[2];
if (!projectDir) {
  console.error("Error: Please provide project directory path as argument");
  process.exit(1);
}

console.log("=== Decoupling project in " + projectDir + " ===");

// 1. Delete proprietary files
const filesToDelete = [
  '.lovable',
  'bun.lock',
  'bunfig.toml',
  'AGENTS.md',
  path.join('src', 'lib', 'lovable-error-reporting.ts')
];

filesToDelete.forEach(f => {
  const fullPath = path.join(projectDir, f);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log("Deleted: " + f);
  }
});

// 2. Clean package.json
const pkgPath = path.join(projectDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    let changed = false;

    // Remove @lovable.dev packages
    ['dependencies', 'devDependencies'].forEach(k => {
      if (!pkg[k]) return;
      Object.keys(pkg[k]).filter(p => p.startsWith('@lovable.dev')).forEach(p => {
        delete pkg[k][p];
        changed = true;
        console.log("Removed package dependency: " + p);
      });
    });

    // Ensure react-start is cleaned or configured
    if (!pkg.devDependencies) pkg.devDependencies = {};
    if (!pkg.devDependencies['@vitejs/plugin-react'] && !pkg.dependencies?.['@vitejs/plugin-react']) {
      pkg.devDependencies['@vitejs/plugin-react'] = '^4.0.0';
      changed = true;
      console.log("Added @vitejs/plugin-react to devDependencies");
    }

    if (changed) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
      console.log("Successfully cleaned package.json");
    }
  } catch (err) {
    console.error("Error cleaning package.json: " + err.message);
  }
}

// 3. Replace vite.config.ts / vite.config.js
try {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const isTanstack = (pkg.dependencies && pkg.dependencies['@tanstack/react-start']) || 
                     (pkg.devDependencies && pkg.devDependencies['@tanstack/react-start']);

  const configFiles = ['vite.config.ts', 'vite.config.js'];
  let configFile = configFiles.find(f => fs.existsSync(path.join(projectDir, f)));
  if (!configFile) configFile = 'vite.config.ts';

  const configFullPath = path.join(projectDir, configFile);
  let needsReplacement = true;
  if (fs.existsSync(configFullPath)) {
    const content = fs.readFileSync(configFullPath, 'utf8');
    needsReplacement = content.includes('@lovable.dev');
  }

  if (needsReplacement) {
    console.log("Replacing config file " + configFile + " (isTanstack: " + !!isTanstack + ")...");
    let newConfig = '';
    if (isTanstack) {
      newConfig = `import { defineConfig } from "vite";
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
    } else {
      newConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { outDir: "dist" },
});
`;
    }
    fs.writeFileSync(configFullPath, newConfig, 'utf8');
    console.log("Successfully replaced vite config!");
  } else {
    console.log("vite config does not use Lovable, keeping as-is.");
  }
} catch (err) {
  console.error("Error replacing vite config: " + err.message);
}

// 4. Clean src/routes/__root.tsx if it exists
const rootPath = path.join(projectDir, 'src', 'routes', '__root.tsx');
if (fs.existsSync(rootPath)) {
  try {
    let c = fs.readFileSync(rootPath, 'utf8');
    const before = c;
    c = c.replace('import { reportLovableError } from "../lib/lovable-error-reporting";', '');
    c = c.replace(/useEffect\(\s*\(\)\s*=>\s*\{\s*reportLovableError\([^)]*\);\s*\}\s*,\s*\[error\]\s*\);?/g, '');
    if (c !== before) {
      fs.writeFileSync(rootPath, c, 'utf8');
      console.log("Cleaned __root.tsx");
    }
  } catch (err) {
    console.error("Error cleaning __root.tsx: " + err.message);
  }
}

console.log("=== Decoupling completed successfully ===");
