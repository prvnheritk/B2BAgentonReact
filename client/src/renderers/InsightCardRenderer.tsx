import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { fadeIn } from '@/animations/variants';

interface Props {
  title: string;
  body: string;
  confidence?: number;
}

export function InsightCardRenderer({ title, body, confidence }: Props) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show" className="my-3">
      <Card className="relative overflow-hidden p-4">
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {title}
          {confidence !== undefined && (
            <span className="ml-auto text-muted-foreground">
              {Math.round(confidence * 100)}% confidence
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-foreground">{body}</p>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-brand-gradient opacity-10 blur-3xl"
        />
      </Card>
    </motion.div>
  );
}
