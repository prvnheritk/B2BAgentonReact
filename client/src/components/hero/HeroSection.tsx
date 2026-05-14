import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { env } from '@/config/env';
import { fadeIn, staggerContainer } from '@/animations/variants';

interface Props {
  onPrimaryAction?: () => void;
}

export function HeroSection({ onPrimaryAction: _ }: Props) {
  return (
    <section className="relative shrink-0 overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-aurora opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--background)/0)_30%,hsl(var(--background))_85%)]"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="container relative flex flex-col items-center gap-2 py-4 md:py-5"
      >
        <motion.div variants={fadeIn}>
          <Badge variant="gradient" className="px-3 py-1">
            <Sparkles className="h-3 w-3" />
            {env.tagline}
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeIn}
          className="text-center text-xl font-semibold leading-tight tracking-tight md:text-2xl"
        >
          The <span className="text-gradient">enterprise AI workspace</span> for Salesforce teams
        </motion.h1>

        <motion.p
          variants={fadeIn}
          className="mx-auto max-w-2xl text-center text-xs text-muted-foreground md:text-sm"
        >
          Pipeline, cases, claims, customers, policies — grounded answers rendered as KPIs, tables,
          timelines, and citations.
        </motion.p>
      </motion.div>
    </section>
  );
}
