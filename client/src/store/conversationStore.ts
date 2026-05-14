import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, IndustryKey, Message } from '@/types/conversation';
import { uuid } from '@/utils/uuid';

interface ConversationState {
  conversations: Record<string, Conversation>;
  activeId: string | null;

  newConversation: (opts?: { industry?: IndustryKey; title?: string }) => string;
  setActive: (id: string) => void;
  removeConversation: (id: string) => void;
  togglePin: (id: string) => void;
  renameConversation: (id: string, title: string) => void;

  setSession: (id: string, sessionId: string, externalSessionKey: string) => void;
  setStatus: (id: string, status: Conversation['status']) => void;
  appendMessage: (id: string, msg: Message) => void;
  updateMessage: (id: string, msgId: string, patch: Partial<Message>) => void;
  appendStreamingDelta: (id: string, msgId: string, delta: string) => void;
  nextSequenceId: (id: string) => number;
}

const seed = (industry?: IndustryKey, title?: string): Conversation => {
  const id = uuid();
  const now = new Date().toISOString();
  return {
    id,
    title: title ?? 'New conversation',
    industry,
    sequenceId: 1,
    messages: [],
    status: 'idle',
    createdAt: now,
    updatedAt: now,
  };
};

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: {},
      activeId: null,

      newConversation: (opts) => {
        const conv = seed(opts?.industry, opts?.title);
        set((s) => ({
          conversations: { ...s.conversations, [conv.id]: conv },
          activeId: conv.id,
        }));
        return conv.id;
      },

      setActive: (id) => set({ activeId: id }),

      removeConversation: (id) =>
        set((s) => {
          const next = { ...s.conversations };
          delete next[id];
          const remaining = Object.keys(next);
          return {
            conversations: next,
            activeId: s.activeId === id ? remaining[0] ?? null : s.activeId,
          };
        }),

      togglePin: (id) =>
        set((s) => {
          const c = s.conversations[id];
          if (!c) return s;
          return {
            conversations: { ...s.conversations, [id]: { ...c, pinned: !c.pinned } },
          };
        }),

      renameConversation: (id, title) =>
        set((s) => {
          const c = s.conversations[id];
          if (!c) return s;
          return {
            conversations: { ...s.conversations, [id]: { ...c, title } },
          };
        }),

      setSession: (id, sessionId, externalSessionKey) =>
        set((s) => {
          const c = s.conversations[id];
          if (!c) return s;
          return {
            conversations: {
              ...s.conversations,
              [id]: { ...c, sessionId, externalSessionKey, updatedAt: new Date().toISOString() },
            },
          };
        }),

      setStatus: (id, status) =>
        set((s) => {
          const c = s.conversations[id];
          if (!c) return s;
          return {
            conversations: {
              ...s.conversations,
              [id]: { ...c, status, updatedAt: new Date().toISOString() },
            },
          };
        }),

      appendMessage: (id, msg) =>
        set((s) => {
          const c = s.conversations[id];
          if (!c) return s;
          const title =
            c.messages.length === 0 && msg.role === 'user'
              ? msg.text.slice(0, 48)
              : c.title;
          return {
            conversations: {
              ...s.conversations,
              [id]: {
                ...c,
                title,
                messages: [...c.messages, msg],
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      updateMessage: (id, msgId, patch) =>
        set((s) => {
          const c = s.conversations[id];
          if (!c) return s;
          return {
            conversations: {
              ...s.conversations,
              [id]: {
                ...c,
                messages: c.messages.map((m) => (m.id === msgId ? { ...m, ...patch } : m)),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      appendStreamingDelta: (id, msgId, delta) =>
        set((s) => {
          const c = s.conversations[id];
          if (!c) return s;
          return {
            conversations: {
              ...s.conversations,
              [id]: {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === msgId ? { ...m, text: m.text + delta, status: 'streaming' } : m,
                ),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      nextSequenceId: (id) => {
        const c = get().conversations[id];
        if (!c) return 1;
        const next = c.sequenceId;
        set((s) => ({
          conversations: { ...s.conversations, [id]: { ...c, sequenceId: c.sequenceId + 1 } },
        }));
        return next;
      },
    }),
    {
      name: 'reactsfagent.conversations',
      partialize: (s) => ({ conversations: s.conversations, activeId: s.activeId }),
    },
  ),
);
