import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/animations/variants';
import { Card } from '@/components/ui/card';

export interface TimelineEntry {
  ts: string;
  label: string;
  detail?: string;
}

export function TimelineRenderer({ entries }: { entries: TimelineEntry[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="my-3"
    >
      <Card className="p-4">
        <ol className="relative space-y-4 border-l border-border pl-4">
          {entries.map((e, i) => (
            <motion.li key={i} variants={fadeIn} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-gradient ring-4 ring-background" />
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {e.ts}
              </div>
              <div className="text-sm font-medium">{e.label}</div>
              {e.detail && (
                <div className="text-xs text-muted-foreground">{e.detail}</div>
              )}
            </motion.li>
          ))}
        </ol>
      </Card>
    </motion.div>
  );
}
