import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { getAccessToken, invalidateToken } from './tokenCache.js';

const client = axios.create({
  baseURL: config.SF_API_BASE_URL,
  timeout: 30_000,
});

async function withAuth<T>(req: AxiosRequestConfig, retry = true): Promise<T> {
  const tok = await getAccessToken();
  try {
    const { data } = await client.request<T>({
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
      logger.warn('agentforce 401 — refreshing token and retrying');
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

export async function createSession(externalSessionKey: string): Promise<CreateSessionResult> {
  const payload = {
    externalSessionKey,
    instanceConfig: { endpoint: config.SF_ORG_URL },
    streamingCapabilities: { chunkTypes: ['Text'] },
    bypassUser: false,
  };
  return withAuth<CreateSessionResult>({
    method: 'POST',
    url: `/einstein/ai-agent/v1/agents/${config.SF_AGENT_ID}/sessions`,
    data: payload,
  });
}

export interface SendMessageInput {
  sessionId: string;
  sequenceId: number;
  text: string;
}

export async function sendMessage(input: SendMessageInput): Promise<unknown> {
  const payload = {
    message: { sequenceId: input.sequenceId, type: 'Text', text: input.text },
  };
  return withAuth({
    method: 'POST',
    url: `/einstein/ai-agent/v1/sessions/${input.sessionId}/messages`,
    data: payload,
  });
}

export async function endSession(sessionId: string): Promise<unknown> {
  return withAuth({
    method: 'DELETE',
    url: `/einstein/ai-agent/v1/sessions/${sessionId}`,
    headers: { 'x-session-end-reason': 'UserRequest' },
  });
}

export async function streamMessage(
  input: SendMessageInput,
  onChunk: (chunk: string) => void,
): Promise<void> {
  const tok = await getAccessToken();
  const payload = {
    message: { sequenceId: input.sequenceId, type: 'Text', text: input.text },
  };
  const res = await client.request({
    method: 'POST',
    url: `/einstein/ai-agent/v1/sessions/${input.sessionId}/messages/stream`,
    data: payload,
    headers: {
      Authorization: `Bearer ${tok.accessToken}`,
      Accept: 'text/event-stream',
    },
    responseType: 'stream',
    timeout: 0,
  });

  // Node stream → forward each line/chunk
  await new Promise<void>((resolve, reject) => {
    res.data.on('data', (buf: Buffer) => onChunk(buf.toString('utf8')));
    res.data.on('end', () => resolve());
    res.data.on('error', (e: Error) => reject(e));
  });
}
