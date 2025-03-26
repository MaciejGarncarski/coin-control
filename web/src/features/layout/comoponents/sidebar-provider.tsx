import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SidebarState = {
  open: boolean
  toggleOpen: () => void
  setOpen: (newTheme: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      open: false,
      toggleOpen: () => set({ open: !get()?.open }),
      setOpen: (open) => {
        return set({ open })
      },
    }),
    {
      name: 'sidebar-state',
    },
  ),
)
