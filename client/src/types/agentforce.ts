export interface SessionCreateResponse {
  sessionId: string;
  externalSessionKey: string;
  _links?: Record<string, unknown>;
  messages?: unknown[];
}

export interface SendMessageResponse {
  messages?: Array<{
    type?: string;
    message?: string;
    citedReferences?: Array<{ source?: string; value?: string }>;
    [k: string]: unknown;
  }>;
  [k: string]: unknown;
}

export interface AuthStatus {
  authenticated: boolean;
  instanceUrl?: string;
  expiresAt?: string;
}
