# GenAI Interview Helper

This project is a full-stack app with a Node/Express backend and a React (Vite) frontend that generates AI-powered interview preparation reports from a resume, self-description, and job description.

## Structure

- `backend/` - Express API, AI integration, MongoDB models and routes
- `frontend/` - React SPA (Vite) for login, form input, and viewing reports

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` in `backend/` with at least:

```bash
MONGODB_URI=...
JWT_KEY=...
GROQ_API_KEY=...
PORT=3000
```

Optional browser override for PDF generation:

```bash
CHROME_PATH=/usr/bin/google-chrome-stable
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend expects the backend at `http://localhost:3000/api`. If you set `VITE_API_BASE_URL`, use the full API base URL, for example `http://localhost:3000/api` in development.

## Deploying On Render

Use the backend as the single Render Web Service and let it serve the built frontend from `backend/public`.

Render build command:

```bash
npm install --prefix backend && npm run build --prefix backend
```

Render start command:

```bash
npm start --prefix backend
```

Required environment variables on Render:

```bash
MONGODB_URI=...
JWT_KEY=...
GROQ_API_KEY=...
PORT=10000
```

If you deploy the frontend separately as a Static Site, set `VITE_API_BASE_URL` to your backend API URL, usually ending in `/api`.

## Notes

- Local PDF generation auto-detects a Chrome/Chromium install on Linux.
- On Render, the app uses the packaged Chromium path automatically.
- The login and interview API calls default to `/api` when `VITE_API_BASE_URL` is not set.

## Features

- Auth-protected API for generating interview reports
- PDF resume upload and parsing
- AI-generated technical and behavioral questions, skill gaps, and preparation plan
- Separate page to view each generated interview report
