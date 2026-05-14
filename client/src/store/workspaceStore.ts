import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkspaceState {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  setLeft: (v: boolean) => void;
  setRight: (v: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      leftCollapsed: false,
      rightCollapsed: false,
      toggleLeft: () => set((s) => ({ leftCollapsed: !s.leftCollapsed })),
      toggleRight: () => set((s) => ({ rightCollapsed: !s.rightCollapsed })),
      setLeft: (v) => set({ leftCollapsed: v }),
      setRight: (v) => set({ rightCollapsed: v }),
    }),
    { name: 'reactsfagent.workspace' },
  ),
);
