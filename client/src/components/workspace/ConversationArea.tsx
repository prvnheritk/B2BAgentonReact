import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useConversationStore } from '@/store/conversationStore';
import { useAgentConversation } from '@/hooks/useAgentConversation';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scrollArea';
import { EmptyState } from './EmptyState';
import { MessageBubble } from './MessageBubble';
import { PromptComposer } from './PromptComposer';
import { SuggestedPrompts } from './SuggestedPrompts';
import { industryByKey } from '@/features/industryDemos';
import { fadeIn } from '@/animations/variants';

export function ConversationArea() {
  const conversations = useConversationStore((s) => s.conversations);
  const activeId = useConversationStore((s) => s.activeId);
  const active = activeId ? conversations[activeId] ?? null : null;
  const newConversation = useConversationStore((s) => s.newConversation);
  const { send } = useAgentConversation();

  useEffect(() => {
    if (!active) newConversation();
  }, [active, newConversation]);

  const scrollRef = useAutoScroll([active?.messages.length, active?.status]);

  if (!active) return null;

  const industry = industryByKey(active.industry);
  const hasMessages = active.messages.length > 0;
  const isStreaming = active.status === 'streaming';

  return (
    <div className="relative flex h-full flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-gradient text-white shadow-glass">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-sm font-medium leading-tight">{active.title}</div>
            <div className="text-[11px] text-muted-foreground">
              Seq #{active.sequenceId - 1} ·{' '}
              {active.sessionId ? `session ${active.sessionId.slice(0, 8)}…` : 'no session yet'}
            </div>
          </div>
        </div>
        {industry && <Badge variant="muted">{industry.label}</Badge>}
      </header>

      <ScrollArea className="flex-1" viewportClassName="px-4 py-4" ref={scrollRef}>
        {hasMessages ? (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <AnimatePresence initial={false}>
              {active.messages.map((m) => (
                <MessageBubble key={m.id} message={m} onPrompt={send} />
              ))}
            </AnimatePresence>

            {industry && !isStreaming && (
              <motion.div variants={fadeIn} initial="hidden" animate="show" className="pt-2">
                <SuggestedPrompts prompts={industry.prompts.slice(0, 3)} onPick={send} />
              </motion.div>
            )}
          </div>
        ) : (
          <EmptyState industry={active.industry} onPickPrompt={send} />
        )}
      </ScrollArea>

      <PromptComposer
        onSubmit={send}
        streaming={isStreaming}
        disabled={isStreaming}
      />
    </div>
  );
}
