# Lovable Decoupler & Surge Publisher

A web application to decouple exported Lovable codebases (removing all Lovable/Bun watermarks and configurations, refactoring to standard Vite setups, fixing broken assets) and deploying them permanently to Surge.sh.

## 🚀 One-Click Mobile Deployment

Click the button below to deploy this server permanently in the cloud for free, so you can access it on your mobile phone:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/khalid8687/lovable-decoupler)

### Manual Cloud Setup
1. Log in to **Render.com** (or create a free account).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select this `lovable-decoupler` repository.
4. Render will automatically detect the `Dockerfile` and build/deploy the application.
5. Once ready, you'll receive a permanent public URL (e.g. `https://lovable-decoupler.onrender.com`) to use from your mobile phone!

## 🔑 Configuration (required)

The app never stores a GitHub token in the browser. Instead, the server
(`server.js`) reads it from an environment variable and proxies the GitHub API
calls. You **must** set it, otherwise the deploy buttons return an error.

| Variable | Required | Description |
| --- | --- | --- |
| `GITHUB_TOKEN` | ✅ | A GitHub token that can write to this repository (`contents: write` + `actions: write`). Use a **fine-grained** token scoped to this repo only. |
| `GITHUB_OWNER` | ➖ | Repo owner. Defaults to `khalid8687`. |
| `GITHUB_REPO` | ➖ | Repo name. Defaults to `lovable-decoupler`. |
| `PORT` | ➖ | Server port. Defaults to `3000` (the Docker image sets `7860`). |

> ⚠️ Two ways to run the page:
> 1. **With the backend** (`npm start`, Docker, or Render) — the frontend calls
>    the `/api/*` endpoints on the same origin and no token is needed in the browser.
> 2. **Static host** (e.g. Surge) — there is no backend, so the page talks to
>    GitHub directly using a token you paste **once**; it is stored only in your
>    browser's `localStorage` (never in the repo). If you host `public/`
>    elsewhere, you can point it at a backend with
>    `window.LOVABLE_API_BASE = "https://your-app.onrender.com"`.

## 📱 How to Use on Mobile
1. Open your deployed Render URL in your mobile browser.
2. Select your Lovable project `.zip` file from your phone's file storage.
3. (Optional) Input a custom Surge subdomain.
4. Click **Decrypt & Publish Site** and view the build logs in real-time.
5. Get your permanent, non-expiring `.surge.sh` link!

---

## 🛠️ Local Development (PC)
If you wish to run the server locally on your PC:
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Start the server with `npm start`.
4. Open `http://localhost:3000` in your browser.
