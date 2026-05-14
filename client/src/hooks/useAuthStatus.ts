import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useSessionStore } from '@/store/sessionStore';

export function useAuthStatus() {
  const setAuth = useSessionStore((s) => s.setAuth);

  const q = useQuery({
    queryKey: ['auth', 'status'],
    queryFn: () => authService.status(),
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (q.data) {
      setAuth({
        authenticated: q.data.authenticated,
        instanceUrl: q.data.instanceUrl,
        expiresAt: q.data.expiresAt,
      });
    } else if (q.isError) {
      setAuth({ authenticated: false });
    }
  }, [q.data, q.isError, setAuth]);

  return q;
}
