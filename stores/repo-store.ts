import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RepoState {
  owner: string
  name: string
  branch: string
  isCodePaneVisible: boolean
  setRepo: (owner: string, name: string, branch: string) => void
  clearRepo: () => void
  toggleCodePane: () => void
}

export const useRepoStore = create<RepoState>()(
  persist(
    (set) => ({
      owner: '',
      name: '',
      branch: 'main',
      isCodePaneVisible: false, // start with it hidden
      setRepo: (owner: string, name: string, branch: string) =>
        set({ owner, name, branch }),
      clearRepo: () => set({ owner: '', name: '', branch: 'main' }),
      toggleCodePane: () => set((state) => ({ isCodePaneVisible: !state.isCodePaneVisible })),
    }),
    {
      name: 'repo-storage', // unique name for localStorage
      partialize: (state) => ({
        owner: state.owner,
        name: state.name,
        branch: state.branch,
        isCodePaneVisible: state.isCodePaneVisible,
      }), // only persist these fields
    }
  )
)
