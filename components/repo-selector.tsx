"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRepoStore } from "@/stores/repo-store"

export function RepoSelector() {
  const { owner, name, branch, setRepo } = useRepoStore()
  const { toast } = useToast()

  const handleSubmit = () => {
    if (!owner || !name) {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: "Please enter both repository owner and name.",
      })
      return
    }

    setRepo(owner, name, branch)
    toast({
      title: "Repository Updated",
      description: `Set to ${owner}/${name} (${branch})`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Repo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="owner">
              Owner
            </label>
            <Input
              id="owner"
              placeholder="e.g. facebook"
              value={owner}
              onChange={(e) => setRepo(e.target.value, name, branch)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              placeholder="e.g. react"
              value={name}
              onChange={(e) => setRepo(owner, e.target.value, branch)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="branch">
              Branch
            </label>
            <Input
              id="branch"
              placeholder="e.g. main"
              value={branch}
              onChange={(e) => setRepo(owner, name, e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Select Repository
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
