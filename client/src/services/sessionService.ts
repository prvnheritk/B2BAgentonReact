import { apiClient } from '@/api/axiosClient';
import { env } from '@/config/env';
import type { SessionCreateResponse } from '@/types/agentforce';
import { uuid } from '@/utils/uuid';

export const sessionService = {
  async create(externalSessionKey = uuid()): Promise<SessionCreateResponse> {
    if (env.useMocks) {
      return { sessionId: `mock-${uuid()}`, externalSessionKey };
    }
    const { data } = await apiClient.post<SessionCreateResponse>('/api/sessions', {
      externalSessionKey,
    });
    return data;
  },

  async end(sessionId: string): Promise<void> {
    if (env.useMocks) return;
    if (sessionId.startsWith('mock-')) return;
    await apiClient.delete(`/api/sessions/${sessionId}`);
  },
};
