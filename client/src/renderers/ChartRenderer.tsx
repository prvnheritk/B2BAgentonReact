import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { fadeIn } from '@/animations/variants';

interface Point {
  label: string;
  value: number;
}

interface Props {
  type: 'bar' | 'line';
  data: Point[];
  title?: string;
}

export function ChartRenderer({ type, data, title }: Props) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show" className="my-3">
      <Card className="p-4">
        {title && (
          <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            {title}
          </div>
        )}
        <div className="h-48 w-full">
          <ResponsiveContainer>
            {type === 'bar' ? (
              <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'currentColor' }} />
                <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="url(#chartGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(263 90% 68%)" />
                    <stop offset="100%" stopColor="hsl(189 94% 56%)" />
                  </linearGradient>
                </defs>
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'currentColor' }} />
                <YAxis tick={{ fontSize: 11, fill: 'currentColor' }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(263 90% 68%)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
