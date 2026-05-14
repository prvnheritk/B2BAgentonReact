import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getConfig } from './config';
import { getAccessToken, invalidateToken } from './tokenCache';

async function withAuth<T>(req: AxiosRequestConfig, retry = true): Promise<T> {
  const cfg = getConfig();
  const tok = await getAccessToken();
  try {
    const { data } = await axios.request<T>({
      baseURL: cfg.SF_API_BASE_URL,
      timeout: 30_000,
      ...req,
      headers: {
        Authorization: `Bearer ${tok.accessToken}`,
        ...(req.headers ?? {}),
      },
    });
    return data;
  } catch (err) {
    const ax = err as AxiosError;
    if (retry && ax.response?.status === 401) {
      invalidateToken();
      return withAuth<T>(req, false);
    }
    throw err;
  }
}

export interface CreateSessionResult {
  sessionId: string;
  _links?: Record<string, unknown>;
  messages?: unknown[];
}

export async function createSession(externalSessionKey: string) {
  const cfg = getConfig();
  return withAuth<CreateSessionResult>({
    method: 'POST',
    url: `/einstein/ai-agent/v1/agents/${cfg.SF_AGENT_ID}/sessions`,
    data: {
      externalSessionKey,
      instanceConfig: { endpoint: cfg.SF_ORG_URL },
      streamingCapabilities: { chunkTypes: ['Text'] },
      bypassUser: false,
    },
  });
}

export async function sendMessage(input: {
  sessionId: string;
  sequenceId: number;
  text: string;
}) {
  return withAuth({
    method: 'POST',
    url: `/einstein/ai-agent/v1/sessions/${input.sessionId}/messages`,
    data: {
      message: { sequenceId: input.sequenceId, type: 'Text', text: input.text },
    },
  });
}

export async function endSession(sessionId: string) {
  return withAuth({
    method: 'DELETE',
    url: `/einstein/ai-agent/v1/sessions/${sessionId}`,
    headers: { 'x-session-end-reason': 'UserRequest' },
  });
}
