/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_USE_MOCKS?: string;
  readonly VITE_SF_ORG_URL?: string;
  readonly VITE_AGENT_ID?: string;
  readonly VITE_DEPLOYMENT_NAME?: string;
  readonly VITE_DEFAULT_THEME?: 'dark' | 'light';
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_TAGLINE?: string;
  readonly VITE_DEV_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
