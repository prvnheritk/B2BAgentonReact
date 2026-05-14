export const env = {
  // Empty string = same-origin (e.g., Vercel Functions at /api/*).
  // For local dev with the Express BFF, set VITE_API_BASE_URL=http://localhost:8787.
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  useMocks: (import.meta.env.VITE_USE_MOCKS ?? 'false') === 'true',
  orgUrl: import.meta.env.VITE_SF_ORG_URL ?? '',
  agentId: import.meta.env.VITE_AGENT_ID ?? '',
  deploymentName: import.meta.env.VITE_DEPLOYMENT_NAME ?? '',
  defaultTheme: (import.meta.env.VITE_DEFAULT_THEME ?? 'dark') as 'dark' | 'light',
  appName: import.meta.env.VITE_APP_NAME ?? 'ReactSFAgent',
  tagline:
    import.meta.env.VITE_APP_TAGLINE ?? 'Enterprise AI Workspace, powered by Agentforce',
};

export type Env = typeof env;
