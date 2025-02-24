import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RepoState {
  owner: string
  name: string
  branch: string
  setRepo: (owner: string, name: string, branch: string) => void
  clearRepo: () => void
}

interface CodePaneState {
  isCodePaneVisible: boolean
  codeContent: string | null
  toggleCodePane: () => void
  setCodeContent: (content: string | null) => void
}

const initialRepoState = {
  owner: '',
  name: '',
  branch: 'main',
}

// Persisted store for repo info
export const useRepoStore = create<RepoState>()(
  persist(
    (set) => ({
      ...initialRepoState,
      setRepo: (owner: string, name: string, branch: string) =>
        set({ owner, name, branch }),
      clearRepo: () => set(initialRepoState),
    }),
    {
      name: 'repo-storage',
    }
  )
)

// Non-persisted store for code pane
export const useCodePaneStore = create<CodePaneState>((set) => ({
  isCodePaneVisible: false,
  codeContent: null,
  toggleCodePane: () => set((state) => ({ isCodePaneVisible: !state.isCodePaneVisible })),
  setCodeContent: (content: string | null) => set({ codeContent: content }),
}))
