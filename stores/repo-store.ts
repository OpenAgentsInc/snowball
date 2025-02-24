import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RepoState {
  owner: string
  name: string
  branch: string
  githubToken: string | null
  setRepo: (owner: string, name: string, branch: string) => void
  setGithubToken: (token: string) => void
  clearRepo: () => void
  fetchFileContent: (filepath: string) => Promise<string>
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
  githubToken: process.env.NEXT_PUBLIC_GITHUB_TOKEN || null,
}

async function fetchFromGitHub(owner: string, repo: string, path: string, ref: string, token: string | null): Promise<string> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3.raw',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${ref}`,
    { headers }
  )

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.text()
}

// Persisted store for repo info
export const useRepoStore = create<RepoState>()(
  persist(
    (set, get) => ({
      ...initialRepoState,
      setRepo: (owner: string, name: string, branch: string) =>
        set({ owner, name, branch }),
      setGithubToken: (token: string) => set({ githubToken: token }),
      clearRepo: () => set(initialRepoState),
      fetchFileContent: async (filepath: string) => {
        const { owner, name, branch, githubToken } = get()
        if (!owner || !name) {
          throw new Error('Repository not set')
        }
        return fetchFromGitHub(owner, name, filepath, branch, githubToken)
      }
    }),
    {
      name: 'repo-storage',
      partialize: (state) => ({
        owner: state.owner,
        name: state.name,
        branch: state.branch,
        githubToken: state.githubToken,
      }),
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
