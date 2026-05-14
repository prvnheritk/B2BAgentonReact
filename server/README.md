# ReactSFAgent — BFF

Stateless Node/Express service that holds the Salesforce
`CLIENT_SECRET`, caches the OAuth access token, proxies Agentforce
session / messaging / streaming endpoints, and exposes a small
`/api/*` surface to the React client.

## Endpoints

| Method | Path                                | Purpose                                  |
| ------ | ----------------------------------- | ---------------------------------------- |
| GET    | `/health`                           | Liveness probe                           |
| GET    | `/api/auth/status`                  | Returns whether a cached token is valid  |
| POST   | `/api/auth/refresh`                 | Force-refresh the cached SF token        |
| POST   | `/api/sessions`                     | Create an Agentforce session             |
| DELETE | `/api/sessions/:sessionId`          | End an Agentforce session                |
| POST   | `/api/messages/:sessionId`          | Send a message (non-streaming)           |
| POST   | `/api/messages/:sessionId/stream`   | Send a message (SSE stream)              |

## Run

```bash
cp .env.example .env
npm install
npm run dev
```
