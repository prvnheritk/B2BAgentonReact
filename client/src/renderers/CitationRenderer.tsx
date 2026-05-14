import { BookText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { fadeIn, staggerContainer } from '@/animations/variants';
import type { Citation } from '@/types/conversation';

export function CitationRenderer({ citations }: { citations: Citation[] }) {
  if (!citations.length) return null;
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="my-3 grid gap-2 md:grid-cols-2"
    >
      {citations.map((c, i) => (
        <motion.div key={c.id || i} variants={fadeIn}>
          <Card className="group flex h-full items-start gap-3 p-3 transition-colors hover:bg-muted/40">
            <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
              <BookText className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="truncate text-sm font-medium">{c.title}</span>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {c.snippet && (
                <div className="line-clamp-2 text-xs text-muted-foreground">{c.snippet}</div>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
