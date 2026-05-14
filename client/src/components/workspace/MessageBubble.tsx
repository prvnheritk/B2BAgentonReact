import { motion } from 'framer-motion';
import { AlertCircle, Bot, User } from 'lucide-react';
import { messageEnter } from '@/animations/variants';
import { SmartResponseRenderer } from '@/renderers/SmartResponseRenderer';
import { CitationRenderer } from '@/renderers/CitationRenderer';
import { StreamingIndicator } from './StreamingIndicator';
import { formatRelative } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Message } from '@/types/conversation';

interface Props {
  message: Message;
  onPrompt?: (text: string) => void;
}

export function MessageBubble({ message, onPrompt }: Props) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      variants={messageEnter}
      initial="hidden"
      animate="show"
      className={cn(
        'group flex w-full gap-3',
        isUser ? 'flex-row-reverse text-right' : 'flex-row',
      )}
    >
      <div
        aria-hidden
        className={cn(
          'mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
          isUser
            ? 'bg-muted text-foreground'
            : 'bg-brand-gradient text-white shadow-glass',
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>

      <div className={cn('min-w-0 flex-1', isUser && 'flex flex-col items-end')}>
        <div
          className={cn(
            'inline-block max-w-full rounded-2xl px-4 py-3 text-sm',
            isUser
              ? 'rounded-tr-md bg-primary/15 text-foreground'
              : 'rounded-tl-md bg-card border border-border text-card-foreground',
          )}
        >
          {message.status === 'error' ? (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{message.error ?? 'Something went wrong.'}</span>
            </div>
          ) : isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          ) : message.status === 'streaming' && !message.text ? (
            <StreamingIndicator />
          ) : (
            <SmartResponseRenderer source={message.text} onPrompt={onPrompt} />
          )}

          {message.citations && message.citations.length > 0 && (
            <div className="mt-2">
              <CitationRenderer citations={message.citations} />
            </div>
          )}
        </div>
        <div
          className={cn(
            'mt-1 text-[10px] text-muted-foreground/70 opacity-0 transition-opacity group-hover:opacity-100',
          )}
        >
          {formatRelative(message.createdAt)}
        </div>
      </div>
    </motion.div>
  );
}
