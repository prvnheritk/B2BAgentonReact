import * as TT from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <TT.Provider delayDuration={250}>{children}</TT.Provider>;
}

interface Props {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function Tooltip({ content, children, side = 'top' }: Props) {
  return (
    <TT.Root>
      <TT.Trigger asChild>{children}</TT.Trigger>
      <TT.Portal>
        <TT.Content
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 overflow-hidden rounded-md border border-border bg-popover',
            'px-2.5 py-1 text-xs text-popover-foreground shadow-md',
            'animate-in fade-in-0 zoom-in-95',
          )}
        >
          {content}
          <TT.Arrow className="fill-popover" />
        </TT.Content>
      </TT.Portal>
    </TT.Root>
  );
}
