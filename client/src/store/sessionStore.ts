import { create } from 'zustand';

interface SessionState {
  authenticated: boolean;
  instanceUrl?: string;
  expiresAt?: string;
  setAuth: (s: Partial<Omit<SessionState, 'setAuth'>>) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  authenticated: false,
  setAuth: (s) => set(s),
}));
