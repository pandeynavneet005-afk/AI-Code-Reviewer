# AI Code Reviewer

A full-stack web app that gives you an instant, professional code review — powered by Google
Gemini. Paste code in the editor, click **Review code**, and get a structured Markdown review
covering correctness, security, performance, readability, and testing, complete with a live score.

```
┌─────────────────────────┐        HTTPS         ┌──────────────────────────┐
│   Frontend (React/Vite) │  ───────────────────▶ │   Backend (Express API)  │
│   Vercel                │  ◀─────────────────── │   Render                 │
└─────────────────────────┘        JSON           └────────────┬─────────────┘
                                                                 │
                                                                 ▼
                                                     Google Gemini API
```

## Features

- Clean, dark/light-mode UI with a live syntax-highlighted code editor
- One-click **Review**, **Clear**, and **Copy review** actions with clear loading states
- Structured AI review (summary, score, critical issues, improvements, strengths) rendered as
  formatted Markdown, with a live score ring
- Hardened Express API: Helmet security headers, CORS allow-list, rate limiting, input validation,
  structured logging, and centralized error handling
- No database or backend account system required — stateless by design
- Ready to deploy: Vercel (frontend) + Render (backend)

## Tech Stack

| Layer     | Technology                                                              |
| --------- | ------------------------------------------------------------------------ |
| Frontend  | React 19, Vite, react-simple-code-editor, react-markdown, Axios          |
| Backend   | Node.js, Express, Helmet, express-rate-limit, Morgan, Winston            |
| AI        | Google Gemini API (`@google/generative-ai`)                              |
| Deploy    | Vercel (frontend), Render (backend)                                      |

## Project Structure

```
.
├── BackEnd/
│   ├── server.js                # Entry point (starts HTTP server, graceful shutdown)
│   ├── render.yaml               # Render deployment blueprint
│   ├── .env.example
│   └── src/
│       ├── app.js                # Express app: middleware & route wiring
│       ├── config/env.js         # Centralized, validated environment config
│       ├── controllers/          # Request handlers
│       ├── routes/               # Route definitions
│       ├── services/             # Gemini integration (prompt + call logic)
│       ├── middlewares/          # Rate limiting, 404, global error handler
│       ├── validators/           # Request body validation
│       └── utils/                # Logger, AppError, catchAsync
│
└── Frontend/
    ├── vercel.json                # Vercel SPA rewrite config
    ├── .env.example
    └── src/
        ├── App.jsx
        ├── components/            # Header, CodeEditor, Toolbar, ReviewPanel, ScoreRing
        ├── hooks/                 # useCodeReview, useTheme
        ├── services/api.js        # Axios client + error normalization
        └── utils/parseScore.js
```

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- A free Google Gemini API key — get one at
  [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd <repo-name>

# Backend
cd BackEnd && npm install

# Frontend
cd ../Frontend && npm install
```

### 2. Configure environment variables

**Backend** — copy `BackEnd/.env.example` to `BackEnd/.env`:

```bash
cd BackEnd
cp .env.example .env
```

Fill in `GOOGLE_GEMINI_KEY` with your API key. For local dev, `CORS_ORIGIN` should match your
frontend's dev URL (default `http://localhost:5173`).

**Frontend** — copy `Frontend/.env.example` to `Frontend/.env`:

```bash
cd Frontend
cp .env.example .env
```

Set `VITE_API_URL` to your backend's URL (default `http://localhost:3000`).

### 3. Run both apps

```bash
# Terminal 1
cd BackEnd && npm run dev

# Terminal 2
cd Frontend && npm run dev
```

Visit `http://localhost:5173`.

## API Reference

### `GET /health`

Health check. Returns `{ success: true, status: "ok", uptime, timestamp }`.

### `POST /ai/get-review`

Request a code review.

**Body:**

```json
{ "code": "function sum(a, b) { return a + b }" }
```

**Success (200):**

```json
{ "success": true, "data": { "review": "### Summary\n..." } }
```

**Error (4xx/5xx):**

```json
{ "success": false, "message": "The \"code\" field cannot be empty." }
```

Requests are rate-limited (default: 60 requests / 15 minutes per IP — configurable via
`RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS`), and code submissions are capped at
`MAX_CODE_LENGTH` characters (default 20,000).

## Deployment

### Backend → Render

1. Push this repository to GitHub.
2. In Render, create a **New Web Service** from your repo (or use the included
   `BackEnd/render.yaml` blueprint via **New → Blueprint**).
3. If configuring manually, set:
   - **Root Directory:** `BackEnd`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/health`
4. Add environment variables from `BackEnd/.env.example` in the Render dashboard, in particular:
   - `GOOGLE_GEMINI_KEY` — your Gemini API key
   - `CORS_ORIGIN` — your deployed frontend URL (e.g. `https://your-app.vercel.app`)
   - `NODE_ENV=production`
5. Deploy. Note the resulting URL, e.g. `https://ai-code-reviewer-backend.onrender.com`.

### Frontend → Vercel

1. In Vercel, import the same repository.
2. Set:
   - **Root Directory:** `Frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add an environment variable:
   - `VITE_API_URL` = your Render backend URL from above
4. Deploy. Once live, update `CORS_ORIGIN` on Render to match your final Vercel URL, then redeploy
   the backend so CORS accepts requests from it.

## Security & Production Hardening

- **Helmet** sets sensible security-related HTTP headers by default.
- **CORS allow-list** — only origins listed in `CORS_ORIGIN` are permitted in production.
- **Rate limiting** on the review endpoint protects against abuse and runaway Gemini API costs.
- **Input validation** rejects missing, non-string, empty, or oversized code submissions before
  they reach the AI service.
- **Centralized error handling** distinguishes expected ("operational") errors from unexpected
  ones, avoiding leaking internals (e.g. stack traces) in production responses.
- **Structured logging** via Winston, with HTTP access logs via Morgan.
- Secrets are never committed — `.env` is git-ignored on both apps; `.env.example` documents the
  required shape.

## License

ISC
