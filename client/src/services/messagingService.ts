import { apiClient } from '@/api/axiosClient';
import { env } from '@/config/env';
import type { SendMessageResponse } from '@/types/agentforce';
import { mockResponseFor } from './mockService';

export interface SendInput {
  sessionId: string;
  sequenceId: number;
  text: string;
}

export interface StreamCallbacks {
  onChunk: (delta: string) => void;
  onDone?: () => void;
  onError?: (err: Error) => void;
}

export const messagingService = {
  async send(input: SendInput): Promise<SendMessageResponse> {
    if (env.useMocks || input.sessionId.startsWith('mock-')) {
      await new Promise((r) => setTimeout(r, 600));
      return mockResponseFor(input.text);
    }
    const { data } = await apiClient.post<SendMessageResponse>(
      `/api/messages/${input.sessionId}`,
      { text: input.text, sequenceId: input.sequenceId },
    );
    return data;
  },

  async stream(input: SendInput, cb: StreamCallbacks): Promise<void> {
    if (env.useMocks || input.sessionId.startsWith('mock-')) {
      return mockStream(input.text, cb);
    }

    const url = `${env.apiBaseUrl.replace(/\/$/, '')}/api/messages/${input.sessionId}/stream`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.text, sequenceId: input.sequenceId }),
      });
      if (!res.ok || !res.body) {
        throw new Error(`stream HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE frames separated by \n\n
        const frames = buffer.split('\n\n');
        buffer = frames.pop() ?? '';

        for (const frame of frames) {
          const event = parseSseFrame(frame);
          if (!event) continue;
          if (event.event === 'done') {
            cb.onDone?.();
            return;
          }
          if (event.event === 'error') {
            cb.onError?.(new Error(event.data || 'stream error'));
            return;
          }
          if (event.data) {
            // Salesforce text chunks may be JSON like {"text": "..."} or plain.
            const delta = extractDelta(event.data);
            if (delta) cb.onChunk(delta);
          }
        }
      }
      cb.onDone?.();
    } catch (err) {
      cb.onError?.(err as Error);
    }
  },
};

function parseSseFrame(frame: string): { event?: string; data?: string } | null {
  const lines = frame.split('\n').filter(Boolean);
  if (!lines.length) return null;
  const out: { event?: string; data?: string } = {};
  const dataParts: string[] = [];
  for (const line of lines) {
    if (line.startsWith('event:')) out.event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataParts.push(line.slice(5).trim());
  }
  if (dataParts.length) out.data = dataParts.join('\n');
  return out;
}

function extractDelta(data: string): string {
  try {
    const parsed = JSON.parse(data);
    if (typeof parsed === 'string') return parsed;
    if (parsed && typeof parsed === 'object') {
      const msg = (parsed.message ?? parsed.text ?? parsed.delta) as string | undefined;
      if (typeof msg === 'string') return msg;
    }
  } catch {
    return data;
  }
  return '';
}

async function mockStream(prompt: string, cb: StreamCallbacks): Promise<void> {
  const mock = mockResponseFor(prompt);
  const fullText =
    mock.messages?.map((m) => (m.message as string) ?? '').join('\n\n') ?? '';
  const tokens = fullText.split(/(\s+)/);
  for (const t of tokens) {
    await new Promise((r) => setTimeout(r, 16 + Math.random() * 30));
    cb.onChunk(t);
  }
  cb.onDone?.();
}
