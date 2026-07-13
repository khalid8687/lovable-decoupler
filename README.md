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
