# GenAI Interview Helper

This project is a full-stack app with a Node/Express backend and a React (Vite) frontend that generates AI-powered interview preparation reports from a resume, self-description, and job description.

## Structure

- `backend/` – Express API, AI integration, MongoDB models and routes
- `frontend/` – React SPA (Vite) for login, form input, and viewing reports

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` in `backend/` with at least:

```bash
MONGO_URI=...
JWT_KEY=...
GEMINI_API_KEY=...
OPENROUTE_API_KEY=...
PORT=3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend expects the backend at `http://localhost:3000/api`.

## Features

- Auth-protected API for generating interview reports
- PDF resume upload and parsing
- AI-generated technical and behavioral questions, skill gaps, and preparation plan
- Separate page to view each generated interview report
