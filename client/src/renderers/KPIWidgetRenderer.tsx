import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { fadeIn, staggerContainer } from '@/animations/variants';
import { cn } from '@/utils/cn';

export interface KPI {
  label: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
}

interface Props {
  data: KPI[];
}

const trendStyles = {
  up:   'text-emerald-400',
  down: 'text-rose-400',
  flat: 'text-muted-foreground',
} as const;

const TrendIcon = ({ trend }: { trend?: KPI['trend'] }) => {
  if (trend === 'down') return <ArrowDownRight className="h-3.5 w-3.5" />;
  if (trend === 'flat') return <Minus className="h-3.5 w-3.5" />;
  return <ArrowUpRight className="h-3.5 w-3.5" />;
};

export function KPIWidgetRenderer({ data }: Props) {
  return (
    <motion.div
      className="my-3 grid grid-cols-2 gap-3 md:grid-cols-4"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {data.map((k, i) => (
        <motion.div key={i} variants={fadeIn}>
          <Card className="relative overflow-hidden p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {k.label}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-xl font-semibold text-gradient">{k.value}</div>
            </div>
            {k.delta && (
              <div
                className={cn(
                  'mt-1 inline-flex items-center gap-1 text-xs',
                  trendStyles[k.trend ?? 'up'],
                )}
              >
                <TrendIcon trend={k.trend} />
                <span>{k.delta}</span>
              </div>
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-gradient opacity-10 blur-2xl"
            />
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
