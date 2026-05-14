import { CheckCircle2, Loader2, ShieldOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { env } from '@/config/env';
import { useSessionStore } from '@/store/sessionStore';

export function StatusBadge() {
  const authenticated = useSessionStore((s) => s.authenticated);

  if (env.useMocks) {
    return (
      <Badge variant="muted" className="gap-1">
        <Loader2 className="h-3 w-3 animate-pulse" />
        Mock mode
      </Badge>
    );
  }

  if (authenticated) {
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Agentforce online
      </Badge>
    );
  }

  return (
    <Badge variant="warning" className="gap-1">
      <ShieldOff className="h-3 w-3" />
      Not authenticated
    </Badge>
  );
}
