import { motion } from 'framer-motion';
import { Mic, Paperclip, SendHorizontal, StopCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

interface Props {
  onSubmit: (text: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  streaming?: boolean;
  placeholder?: string;
  initialText?: string;
}

export function PromptComposer({
  onSubmit,
  onStop,
  disabled,
  streaming,
  placeholder,
  initialText,
}: Props) {
  const [value, setValue] = useState(initialText ?? '');
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialText !== undefined) setValue(initialText);
  }, [initialText]);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 220) + 'px';
  }, [value]);

  const submit = () => {
    const t = value.trim();
    if (!t || disabled) return;
    setValue('');
    onSubmit(t);
  };

  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="sticky bottom-0 z-10 border-t border-border bg-background/80 px-4 py-3 backdrop-blur-xl"
    >
      <div
        className={cn(
          'mx-auto flex max-w-5xl items-end gap-2 rounded-2xl border border-border bg-card/60 p-2 shadow-glass',
          'focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20',
        )}
      >
        <Tooltip content="Attach (coming soon)">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled
            className="text-muted-foreground"
            aria-label="Attach a file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Textarea
          ref={taRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder ?? 'Ask Agentforce anything — pipeline, cases, claims, customers…'}
          rows={1}
          className="flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm focus-visible:ring-0"
        />

        <Tooltip content="Voice (coming soon)">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            disabled
            className="text-muted-foreground"
            aria-label="Voice input"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </Tooltip>

        {streaming ? (
          <Tooltip content="Stop">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onStop?.()}
              aria-label="Stop generation"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          </Tooltip>
        ) : (
          <Tooltip content={value.trim() ? 'Send  ⏎' : 'Type a message'}>
            <Button
              variant="gradient"
              size="icon"
              onClick={submit}
              disabled={disabled || !value.trim()}
              aria-label="Send message"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </Tooltip>
        )}
      </div>
      <p className="mx-auto mt-2 max-w-5xl text-center text-[10px] text-muted-foreground/70">
        Agentforce can make mistakes. Verify business-critical responses before acting.
      </p>
    </motion.div>
  );
}
