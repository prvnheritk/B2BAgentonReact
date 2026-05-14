import { apiClient } from '@/api/axiosClient';
import { env } from '@/config/env';
import type { AuthStatus } from '@/types/agentforce';

export const authService = {
  async status(): Promise<AuthStatus> {
    if (env.useMocks) {
      return { authenticated: true, instanceUrl: 'mock://salesforce', expiresAt: new Date(Date.now() + 3600_000).toISOString() };
    }
    const { data } = await apiClient.get<AuthStatus>('/api/auth/status');
    return data;
  },

  async refresh(): Promise<void> {
    if (env.useMocks) return;
    await apiClient.post('/api/auth/refresh');
  },
};
