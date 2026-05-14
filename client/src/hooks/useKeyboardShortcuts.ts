import { useEffect } from 'react';
import { useConversationStore } from '@/store/conversationStore';

/**
 * Global shortcuts:
 *   Ctrl/Cmd + K → focus composer
 *   Ctrl/Cmd + N → new conversation
 */
export function useKeyboardShortcuts() {
  const newConversation = useConversationStore((s) => s.newConversation);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;

      if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const ta = document.querySelector<HTMLTextAreaElement>('textarea');
        ta?.focus();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        newConversation();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [newConversation]);
}
