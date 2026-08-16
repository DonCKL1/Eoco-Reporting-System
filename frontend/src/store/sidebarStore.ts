import { create } from 'zustand'

interface SidebarState {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

/** Sidebar starts collapsed on mobile so it never overlaps the dashboard on login */
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

export const useSidebarStore = create<SidebarState>()((set) => ({
  isOpen: !isMobile,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
