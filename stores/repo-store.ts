import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RepoState {
  owner: string
  name: string
  branch: string
  setRepo: (owner: string, name: string, branch: string) => void
  clearRepo: () => void
}

export const useRepoStore = create<RepoState>()(
  persist(
    (set) => ({
      owner: '',
      name: '',
      branch: 'main',
      setRepo: (owner: string, name: string, branch: string) =>
        set({ owner, name, branch }),
      clearRepo: () => set({ owner: '', name: '', branch: 'main' }),
    }),
    {
      name: 'repo-storage', // unique name for localStorage
      partialize: (state) => ({
        owner: state.owner,
        name: state.name,
        branch: state.branch,
      }), // only persist these fields
    }
  )
)
