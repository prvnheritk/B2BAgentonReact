import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SuggestedPrompts } from './SuggestedPrompts';
import { industryByKey, industryTemplates } from '@/features/industryDemos';
import type { IndustryKey } from '@/types/conversation';
import { fadeIn, staggerContainer } from '@/animations/variants';

interface Props {
  industry?: IndustryKey;
  onPickPrompt: (p: string) => void;
}

export function EmptyState({ industry, onPickPrompt }: Props) {
  const t = industryByKey(industry);
  const featured = t ? t.prompts : industryTemplates.flatMap((i) => i.prompts).slice(0, 6);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto flex h-full max-w-3xl flex-col justify-center px-6 py-10"
    >
      <motion.div variants={fadeIn} className="mb-3 flex items-center gap-2">
        <Badge variant="gradient">
          <Sparkles className="h-3 w-3" />
          {t ? `${t.label} workspace` : 'Start anywhere'}
        </Badge>
      </motion.div>
      <motion.h2 variants={fadeIn} className="text-2xl font-semibold tracking-tight md:text-3xl">
        {t ? t.tagline : 'What would you like to do today?'}
      </motion.h2>
      <motion.p variants={fadeIn} className="mt-1 max-w-xl text-sm text-muted-foreground">
        Ask in plain English. ReactSFAgent will ground its answer in your
        Salesforce data and render it with the right widget — KPIs, tables,
        timelines, citations.
      </motion.p>

      <motion.div variants={fadeIn} className="mt-6">
        <SuggestedPrompts prompts={featured} onPick={onPickPrompt} />
      </motion.div>

      {!t && (
        <motion.div variants={fadeIn} className="mt-8 grid gap-3 md:grid-cols-3">
          {industryTemplates.slice(0, 6).map((it) => (
            <Card key={it.key} className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {it.label}
              </div>
              <div className="mt-1 text-sm">{it.tagline}</div>
            </Card>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
