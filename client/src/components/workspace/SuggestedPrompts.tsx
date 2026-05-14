import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { fadeIn, staggerContainer } from '@/animations/variants';
import { cn } from '@/utils/cn';

interface Props {
  prompts: string[];
  onPick: (p: string) => void;
  className?: string;
}

export function SuggestedPrompts({ prompts, onPick, className }: Props) {
  if (!prompts.length) return null;
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={cn('flex flex-wrap gap-2', className)}
    >
      {prompts.map((p, i) => (
        <motion.button
          key={i}
          variants={fadeIn}
          onClick={() => onPick(p)}
          className={cn(
            'group inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60',
            'px-3 py-1.5 text-xs text-muted-foreground transition-colors',
            'hover:border-primary/60 hover:bg-primary/10 hover:text-foreground',
          )}
        >
          <Sparkles className="h-3 w-3 text-primary opacity-70 group-hover:opacity-100" />
          {p}
        </motion.button>
      ))}
    </motion.div>
  );
}
