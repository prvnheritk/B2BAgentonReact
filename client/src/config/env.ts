export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
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
