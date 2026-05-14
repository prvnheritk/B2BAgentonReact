import { motion } from 'framer-motion';
import { MessageSquarePlus, Pin, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scrollArea';
import { Tooltip } from '@/components/ui/tooltip';
import { useConversationStore } from '@/store/conversationStore';
import { industryIcons, industryTemplates } from '@/features/industryDemos';
import { fadeIn, sidebarItem, staggerContainer } from '@/animations/variants';
import { formatRelative, truncate } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { IndustryKey } from '@/types/conversation';

export function Sidebar() {
  const conversations = useConversationStore((s) => s.conversations);
  const activeId = useConversationStore((s) => s.activeId);
  const setActive = useConversationStore((s) => s.setActive);
  const newConversation = useConversationStore((s) => s.newConversation);
  const removeConversation = useConversationStore((s) => s.removeConversation);
  const togglePin = useConversationStore((s) => s.togglePin);

  const [filter, setFilter] = useState('');

  const list = useMemo(
    () =>
      Object.values(conversations).sort((a, b) => {
        if ((a.pinned ? 1 : 0) !== (b.pinned ? 1 : 0)) return a.pinned ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      }),
    [conversations],
  );

  const filtered = useMemo(
    () =>
      filter.trim()
        ? list.filter((c) => c.title.toLowerCase().includes(filter.toLowerCase()))
        : list,
    [filter, list],
  );

  const startFromTemplate = (key: IndustryKey, label: string) => {
    newConversation({ industry: key, title: `${label} demo` });
  };

  return (
    <aside className="flex h-full flex-col border-r border-border bg-card/40 backdrop-blur-xl">
      <div className="space-y-2 border-b border-border p-3">
        <Button
          variant="gradient"
          className="w-full justify-start"
          onClick={() => newConversation()}
        >
          <MessageSquarePlus className="h-4 w-4" />
          New conversation
        </Button>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search conversations"
            className={cn(
              'w-full rounded-md border border-input bg-background px-7 py-1.5 text-xs',
              'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-ring',
            )}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-3 p-3"
        >
          {filtered.length > 0 && (
            <div>
              <div className="mb-1 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                Recent
              </div>
              <ul className="space-y-1">
                {filtered.map((c) => {
                  const isActive = c.id === activeId;
                  return (
                    <motion.li key={c.id} variants={sidebarItem}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setActive(c.id)}
                        onKeyDown={(e) => e.key === 'Enter' && setActive(c.id)}
                        className={cn(
                          'group relative cursor-pointer rounded-md px-2 py-1.5 text-sm',
                          'transition-colors',
                          isActive
                            ? 'bg-primary/15 text-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          {c.pinned && <Pin className="h-3 w-3 text-primary" />}
                          <span className="flex-1 truncate">
                            {truncate(c.title, 36)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            {formatRelative(c.updatedAt)}
                          </span>
                          <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                            <Tooltip content={c.pinned ? 'Unpin' : 'Pin'}>
                              <button
                                className="rounded p-1 text-muted-foreground hover:text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePin(c.id);
                                }}
                                aria-label="Pin conversation"
                              >
                                <Pin className="h-3 w-3" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Delete">
                              <button
                                className="rounded p-1 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeConversation(c.id);
                                }}
                                aria-label="Delete conversation"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          )}

          <motion.div variants={fadeIn}>
            <div className="mb-1 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              Industry templates
            </div>
            <ul className="space-y-1">
              {industryTemplates.map((t) => {
                const Icon = industryIcons[t.key];
                return (
                  <li key={t.key}>
                    <button
                      onClick={() => startFromTemplate(t.key, t.label)}
                      className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Icon className="mt-0.5 h-3.5 w-3.5 text-primary" />
                      <div className="min-w-0">
                        <div className="text-sm">{t.label}</div>
                        <div className="line-clamp-1 text-[11px] text-muted-foreground/80">
                          {t.tagline}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      </ScrollArea>
    </aside>
  );
}
