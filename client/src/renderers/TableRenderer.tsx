import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { fadeIn } from '@/animations/variants';

interface Props {
  rows: Record<string, unknown>[];
  caption?: string;
}

export function TableRenderer({ rows, caption }: Props) {
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show" className="my-3">
      <Card className="overflow-hidden">
        {caption && (
          <div className="border-b border-border bg-muted/30 px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground">
            {caption}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                {headers.map((h) => (
                  <th key={h} className="px-4 py-2 text-xs font-medium text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                  {headers.map((h) => (
                    <td key={h} className="px-4 py-2.5 align-top">
                      {String(r[h] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
