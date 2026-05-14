import { ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeIn } from '@/animations/variants';

export interface ActionDef {
  label: string;
  intent: 'prompt' | 'link';
  prompt?: string;
  href?: string;
}

interface Props {
  actions: ActionDef[];
  onPrompt?: (text: string) => void;
}

export function ActionsRenderer({ actions, onPrompt }: Props) {
  if (!actions.length) return null;
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show" className="my-3 flex flex-wrap gap-2">
      {actions.map((a, i) => {
        if (a.intent === 'link') {
          return (
            <Button key={i} variant="outline" size="sm" asChild>
              <a href={a.href ?? '#'} target="_blank" rel="noreferrer noopener">
                {a.label}
                <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </a>
            </Button>
          );
        }
        return (
          <Button
            key={i}
            variant="glass"
            size="sm"
            onClick={() => a.prompt && onPrompt?.(a.prompt)}
          >
            {a.label}
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        );
      })}
    </motion.div>
  );
}
