import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

const MAX_RETRIES = 2;

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 60_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((cfg) => {
  // BFF holds the SF token — the client never attaches Authorization.
  // Hook reserved for future user-session bearer (e.g., Auth0).
  return cfg;
});

interface RetryConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}

apiClient.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const cfg = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    // 401 → ask BFF to refresh the cached SF token, then retry once.
    if (status === 401 && cfg && !cfg.__retryCount) {
      cfg.__retryCount = 1;
      try {
        await apiClient.post('/api/auth/refresh');
        return apiClient(cfg);
      } catch {
        return Promise.reject(error);
      }
    }

    // Idempotent retry for 5xx and network errors.
    const retriable =
      !status || status >= 500 || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
    if (retriable && cfg && (cfg.__retryCount ?? 0) < MAX_RETRIES) {
      cfg.__retryCount = (cfg.__retryCount ?? 0) + 1;
      const backoff = 250 * 2 ** (cfg.__retryCount - 1);
      await new Promise((r) => setTimeout(r, backoff));
      return apiClient(cfg);
    }

    return Promise.reject(error);
  },
);
