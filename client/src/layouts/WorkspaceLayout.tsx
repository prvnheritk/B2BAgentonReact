import { Menu, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { env } from '@/config/env';
import { cn } from '@/utils/cn';

interface Props {
  hero: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
  context: ReactNode;
}

export function WorkspaceLayout({ hero, sidebar, main, context }: Props) {
  const left = useWorkspaceStore((s) => s.leftCollapsed);
  const right = useWorkspaceStore((s) => s.rightCollapsed);
  const toggleLeft = useWorkspaceStore((s) => s.toggleLeft);
  const toggleRight = useWorkspaceStore((s) => s.toggleRight);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="z-20 flex items-center justify-between border-b border-border bg-background/70 px-4 py-2 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Tooltip content={left ? 'Show sidebar' : 'Hide sidebar'}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLeft}
              aria-label="Toggle sidebar"
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </Tooltip>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-gradient text-white shadow-elevated">
            <span className="text-xs font-bold">R</span>
          </div>
          <div>
            <div className="text-sm font-semibold leading-none">{env.appName}</div>
            <div className="text-[10px] text-muted-foreground">{env.tagline}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge />
          <ThemeToggle />
          <Tooltip content={right ? 'Show context panel' : 'Hide context panel'}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRight}
              aria-label="Toggle context panel"
              className="hidden lg:inline-flex"
            >
              {right ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
            </Button>
          </Tooltip>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {hero}
        </motion.div>

        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[18rem_1fr] lg:grid-cols-[18rem_1fr_22rem]">
          <div
            className={cn(
              'hidden h-full overflow-hidden border-border md:block',
              left && 'md:hidden',
            )}
          >
            {sidebar}
          </div>

          <main className="relative h-full overflow-hidden">{main}</main>

          <div
            className={cn(
              'hidden h-full overflow-hidden lg:block',
              right && 'lg:hidden',
            )}
          >
            {context}
          </div>
        </div>
      </div>
    </div>
  );
}
