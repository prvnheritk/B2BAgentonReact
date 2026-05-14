# ReactSFAgent — client

The premium React workspace. Vite + TypeScript + Tailwind + shadcn-style
primitives + Framer Motion + Zustand + TanStack Query.

## Run

```bash
cp .env.example .env
# Either point at the BFF (recommended) ...
#   VITE_API_BASE_URL=http://localhost:8787
# ... or run UI-only with the demo recipes:
#   VITE_USE_MOCKS=true
npm install
npm run dev
```

## What's where

| Path | Role |
|---|---|
| `src/api/`         | Axios client with refresh-on-401 + retries |
| `src/services/`    | `authService`, `sessionService`, `messagingService`, `mockService` |
| `src/hooks/`       | `useAgentConversation`, `useAuthStatus`, `useAutoScroll`, shortcuts |
| `src/store/`       | Zustand stores (conversation, session, theme, workspace) |
| `src/components/ui/` | Primitive shadcn-style components |
| `src/components/workspace/` | Sidebar / ConversationArea / ContextPanel / Composer / etc. |
| `src/components/hero/`      | Landing hero |
| `src/renderers/`   | Markdown / KPI / Table / Timeline / Citation / Chart / SmartResponse |
| `src/features/`    | Industry demo definitions |
| `src/layouts/`     | `WorkspaceLayout` (header + 3-column grid) |
| `src/theme/`       | `ThemeProvider` |
| `src/animations/`  | Framer Motion variants |
| `src/types/`       | Conversation + Agentforce types |

## Keyboard

- `Ctrl/Cmd + K` — focus composer
- `Ctrl/Cmd + N` — new conversation
- `Enter` — send · `Shift + Enter` — newline

## SmartResponseRenderer

Assistant text can mix Markdown with these fenced "smart" blocks. The
mock service uses them; the real Agentforce backend can be prompted to
emit them, or you can post-process its responses to inject them.

````
```kpi
[{ "label":"Pipeline", "value":"$48M", "delta":"+12%", "trend":"up" }]
```

```chart
{ "type":"bar", "data":[{"label":"Q1","value":12},...] }
```

```timeline
[{ "ts":"09:12", "label":"Claim filed", "detail":"Auto · collision" }]
```

```citations
[{ "title":"Policy 88-A clause 4.2", "snippet":"Comprehensive…" }]
```

```actions
[{ "label":"Open in Salesforce", "intent":"link", "href":"…" },
 { "label":"Summarise all 3",   "intent":"prompt", "prompt":"Summarise…" }]
```
````
