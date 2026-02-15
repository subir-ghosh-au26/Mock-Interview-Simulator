# NexRound: Deployment Guide 🚀

This guide explains how to deploy the NexRound application using a split architecture: **Vercel** for the frontend and **Render** for the backend (API).

---

## 🏗️ 1. Backend Deployment (Render)

Render is used to host the Express server.

### Steps:
1. **Create a New Web Service**:
   - Connect your GitHub repository.
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
2. **Environment Variables**:
   Add the following in the Render Dashboard:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `JWT_SECRET`: A long random string for auth.
   - `PORT`: `5000` (optional, Render handles this).
   - `ALLOWED_ORIGINS`: `https://your-app.vercel.app` (The URL of your frontend after Step 2).
   - `NODE_ENV`: `production`

---

## 🌐 2. Frontend Deployment (Vercel)

Vercel is used to host the React/Vite frontend.

### Steps:
1. **Create a New Project**:
   - Connect your GitHub repository.
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
2. **Environment Variables**:
   Add the following in the Vercel Dashboard:
   - `VITE_API_URL`: `https://your-render-app.onrender.com/api` (The URL of your backend).

---

## 🔗 3. Connecting the Two

1. First, deploy the **Backend on Render** to get the URL.
2. Then, deploy the **Frontend on Vercel** using the Render URL as `VITE_API_URL`.
3. Finally, go back to Render and update `ALLOWED_ORIGINS` with your new Vercel URL to enable CORS.

---

## 🩺 4. Monitoring (UptimeRobot)

Once deployed, point your UptimeRobot monitor to:
`https://your-render-app.onrender.com/health`

---
*Happy Interviewing!*
