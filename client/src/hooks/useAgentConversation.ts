import { useCallback, useRef } from 'react';
import { useConversationStore } from '@/store/conversationStore';
import { messagingService } from '@/services/messagingService';
import { sessionService } from '@/services/sessionService';
import type { Message } from '@/types/conversation';
import { uuid } from '@/utils/uuid';

interface SendOpts {
  stream?: boolean;
}

export function useAgentConversation() {
  const conversations = useConversationStore((s) => s.conversations);
  const activeId = useConversationStore((s) => s.activeId);
  const active = activeId ? conversations[activeId] ?? null : null;
  const setSession = useConversationStore((s) => s.setSession);
  const setStatus = useConversationStore((s) => s.setStatus);
  const appendMessage = useConversationStore((s) => s.appendMessage);
  const updateMessage = useConversationStore((s) => s.updateMessage);
  const appendDelta = useConversationStore((s) => s.appendStreamingDelta);
  const nextSequenceId = useConversationStore((s) => s.nextSequenceId);

  const inflightRef = useRef<AbortController | null>(null);

  const ensureSession = useCallback(async (): Promise<string | null> => {
    if (!active) return null;
    if (active.sessionId) return active.sessionId;
    try {
      setStatus(active.id, 'loading');
      const res = await sessionService.create();
      setSession(active.id, res.sessionId, res.externalSessionKey);
      setStatus(active.id, 'idle');
      return res.sessionId;
    } catch (err) {
      setStatus(active.id, 'error');
      throw err;
    }
  }, [active, setSession, setStatus]);

  const send = useCallback(
    async (text: string, opts: SendOpts = { stream: false }) => {
      if (!active) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      const sessionId = await ensureSession();
      if (!sessionId) return;

      const sequenceId = nextSequenceId(active.id);
      const now = new Date().toISOString();

      const userMsg: Message = {
        id: uuid(),
        role: 'user',
        text: trimmed,
        status: 'complete',
        createdAt: now,
        sequenceId,
      };
      appendMessage(active.id, userMsg);

      const assistantId = uuid();
      const assistantMsg: Message = {
        id: assistantId,
        role: 'assistant',
        text: '',
        status: 'streaming',
        createdAt: new Date().toISOString(),
      };
      appendMessage(active.id, assistantMsg);
      setStatus(active.id, 'streaming');

      try {
        if (opts.stream) {
          await messagingService.stream(
            { sessionId, sequenceId, text: trimmed },
            {
              onChunk: (delta) => appendDelta(active.id, assistantId, delta),
              onDone: () => {
                updateMessage(active.id, assistantId, { status: 'complete' });
                setStatus(active.id, 'idle');
              },
              onError: (err) => {
                updateMessage(active.id, assistantId, { status: 'error', error: err.message });
                setStatus(active.id, 'error');
              },
            },
          );
        } else {
          const res = await messagingService.send({ sessionId, sequenceId, text: trimmed });
          const replyText = extractReplyText(res);
          updateMessage(active.id, assistantId, { text: replyText, status: 'complete' });
          setStatus(active.id, 'idle');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        updateMessage(active.id, assistantId, { status: 'error', error: message });
        setStatus(active.id, 'error');
      }
    },
    [active, appendDelta, appendMessage, ensureSession, nextSequenceId, setStatus, updateMessage],
  );

  const cancel = useCallback(() => {
    inflightRef.current?.abort();
    inflightRef.current = null;
  }, []);

  return { send, cancel, active };
}

/**
 * Best-effort extraction of human-readable text from an Agentforce response.
 * The shape varies: usually messages[].message, sometimes .text/.content,
 * occasionally a top-level field. We try them all so the UI never blanks.
 */
function extractReplyText(res: unknown): string {
  if (!res || typeof res !== 'object') return '';
  const r = res as Record<string, unknown>;
  const arr = Array.isArray(r.messages) ? (r.messages as Record<string, unknown>[]) : [];
  const collected: string[] = [];

  for (const m of arr) {
    for (const k of ['message', 'text', 'content', 'value'] as const) {
      const v = m[k];
      if (typeof v === 'string' && v.trim()) {
        collected.push(v);
        break;
      }
    }
  }

  if (collected.length === 0) {
    for (const k of ['text', 'message', 'content'] as const) {
      const v = r[k];
      if (typeof v === 'string' && v.trim()) {
        collected.push(v);
        break;
      }
    }
  }

  return collected.join('\n\n');
}
