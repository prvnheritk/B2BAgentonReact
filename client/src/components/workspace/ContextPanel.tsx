import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Cpu,
  Layers,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scrollArea';
import { Button } from '@/components/ui/button';
import { useConversationStore } from '@/store/conversationStore';
import { useAgentConversation } from '@/hooks/useAgentConversation';
import { useSessionStore } from '@/store/sessionStore';
import { industryByKey } from '@/features/industryDemos';
import { fadeIn, staggerContainer } from '@/animations/variants';
import { env } from '@/config/env';
import { formatRelative } from '@/utils/format';

export function ContextPanel() {
  const conversations = useConversationStore((s) => s.conversations);
  const activeId = useConversationStore((s) => s.activeId);
  const active = activeId ? conversations[activeId] ?? null : null;
  const authenticated = useSessionStore((s) => s.authenticated);
  const instanceUrl = useSessionStore((s) => s.instanceUrl);
  const expiresAt = useSessionStore((s) => s.expiresAt);
  const auth = { authenticated, instanceUrl, expiresAt };
  const { send } = useAgentConversation();

  const industry = industryByKey(active?.industry);
  const messageCount = active?.messages.length ?? 0;
  const userTurns = active?.messages.filter((m) => m.role === 'user').length ?? 0;

  return (
    <aside className="h-full border-l border-border bg-card/40 backdrop-blur-xl">
      <ScrollArea className="h-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-3 p-3"
        >
          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground">
                <Row label="State">
                  <Badge variant={active?.status === 'error' ? 'danger' : active?.status === 'streaming' ? 'gradient' : 'success'}>
                    {active?.status ?? 'idle'}
                  </Badge>
                </Row>
                <Row label="Sequence">#{(active?.sequenceId ?? 1) - 1}</Row>
                <Row label="Turns">{userTurns}</Row>
                <Row label="Messages">{messageCount}</Row>
                <Row label="Updated">
                  {active ? formatRelative(active.updatedAt) : '—'}
                </Row>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-primary" />
                  Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <Row label="Agent ID">
                  <code className="text-[10px]">
                    {env.agentId || '—'}
                  </code>
                </Row>
                <Row label="Org">
                  <code className="break-all text-[10px]">
                    {auth.instanceUrl || env.orgUrl || '—'}
                  </code>
                </Row>
                <Row label="Token">
                  {env.useMocks
                    ? 'mock'
                    : auth.expiresAt
                      ? `valid · ${formatRelative(auth.expiresAt)}`
                      : '—'}
                </Row>
              </CardContent>
            </Card>
          </motion.div>

          {industry && (
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    {industry.label} prompts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {industry.prompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="group flex w-full items-start gap-2 rounded-md p-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <ArrowRight className="mt-0.5 h-3 w-3 text-primary opacity-70 group-hover:opacity-100" />
                      <span className="line-clamp-2">{p}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-3.5 w-3.5 text-primary" />
                  Suggested actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Once a response arrives, action chips appear in the message
                  and queue follow-up prompts here.
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => send('Summarise our conversation so far.')}>
                  Summarise this conversation
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Memory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ClipboardList className="mt-0.5 h-3 w-3 text-primary" />
                    Conversation persists across refresh
                  </li>
                  <li className="flex items-start gap-2">
                    <ClipboardList className="mt-0.5 h-3 w-3 text-primary" />
                    Sequence IDs handled automatically
                  </li>
                  <li className="flex items-start gap-2">
                    <ClipboardList className="mt-0.5 h-3 w-3 text-primary" />
                    Pin important threads from the sidebar
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </ScrollArea>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{children}</span>
    </div>
  );
}
