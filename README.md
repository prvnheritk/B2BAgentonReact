# ReactSFAgent

A premium, production-grade React workspace that talks to Salesforce
**Agentforce** via OAuth (client_credentials) — designed to feel like an
**enterprise AI operating system**, not a chatbot.

The homepage **is** the workspace: hero + embedded conversation area +
contextual intelligence panel, all on one screen, with streaming
responses, KPI widgets, rich markdown, tables, charts, citations, and a
dark/light theme.

## Architecture

```
React (Vite + TS + Tailwind + shadcn/ui + Framer Motion + Zustand + TanStack Query)
        ↓  (axios → /api)
Node/Express BFF  (token cache, rate limit, audit log, streaming proxy)
        ↓
Salesforce  (OAuth /services/oauth2/token  +  /einstein/ai-agent/v1/...)
```

The frontend **never** sees `CLIENT_SECRET`. All Agentforce traffic goes
through the BFF.

## Layout

```
uiBundles/ReactSFAgent/
├── client/        React 18 + Vite + TS workspace
├── server/        Node + Express BFF (token cache, proxy, streaming)
└── README.md
```

## Quick start

```bash
# 1. Server
cd server
cp .env.example .env             # fill in CLIENT_ID/SECRET/AGENT_ID
npm install
npm run dev                      # http://localhost:8787

# 2. Client (new terminal)
cd client
cp .env.example .env             # VITE_API_BASE_URL=http://localhost:8787
npm install
npm run dev                      # http://localhost:5173
```

Open http://localhost:5173 — the homepage **is** the workspace.

### Mock mode

Set `VITE_USE_MOCKS=true` in `client/.env` to run the full UI with no
Salesforce credentials. Industry demo conversations (Banking, Insurance,
Retail, Telecom, Healthcare, Manufacturing) are pre-seeded.

## Phases

- **Phase 1 — Foundation** — Vite/TS/Tailwind scaffold, theme tokens,
  Zustand stores, axios + interceptors, auth/session/messaging service
  scaffolding.
- **Phase 2 — Homepage + Embedded AI Workspace** — Hero, sidebar,
  conversation area, context panel, sticky composer, responsive grid.
- **Phase 3 — Agentforce Integration** — OAuth (BFF), session
  initialization, sequenced messaging, SSE streaming, persistence,
  reconnect.
- **Phase 4 — Rich Rendering Engine** — Markdown, tables, KPI widgets,
  charts, timelines, citations, code blocks, SmartResponseRenderer.
- **Phase 5 — Premium UX Polish** — Framer Motion variants, skeleton
  loaders, streaming UX, empty/error states, dark/light mode,
  accessibility.

## Deployment

The client is a static SPA (Vercel / Netlify / Amplify). The server is
a stateless Node service (Render / Fly / Heroku / ECS). They are
deployed independently and connected via `VITE_API_BASE_URL`.

## Security

- `CLIENT_SECRET` lives only on the server.
- Tokens cached server-side with TTL; refreshed on 401.
- All markdown is sanitised before render.
- Helmet, CORS allowlist, and `express-rate-limit` on the BFF.
- Server-Sent Events for streaming — no secrets in the stream.
