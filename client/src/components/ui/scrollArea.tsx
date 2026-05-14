import * as SA from '@radix-ui/react-scroll-area';
import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface Props {
  children: ReactNode;
  className?: string;
  viewportClassName?: string;
}

export const ScrollArea = forwardRef<HTMLDivElement, Props>(
  ({ children, className, viewportClassName }, ref) => (
    <SA.Root className={cn('overflow-hidden', className)}>
      <SA.Viewport ref={ref} className={cn('h-full w-full', viewportClassName)}>
        {children}
      </SA.Viewport>
      <SA.Scrollbar
        orientation="vertical"
        className="flex w-2 touch-none select-none p-0.5 transition-colors"
      >
        <SA.Thumb className="relative flex-1 rounded-full bg-border" />
      </SA.Scrollbar>
      <SA.Corner />
    </SA.Root>
  ),
);
ScrollArea.displayName = 'ScrollArea';
