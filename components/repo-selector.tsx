"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRepoStore } from "@/stores/repo-store"
import { ChevronDown, ChevronUp, Github } from "lucide-react"

export function RepoSelector() {
  const { owner, name, branch, setRepo } = useRepoStore()
  const { toast } = useToast()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = () => {
    console.log('Submitting repo:', { owner, name, branch })
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
    setIsExpanded(false)
  }

  const handleExpand = () => {
    console.log('Expanding repo selector')
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    console.log('Collapsing repo selector')
    setIsExpanded(false)
  }

  return (
    <div className="fixed top-6 left-6 z-40">
      {isExpanded ? (
        <Card className="w-80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Active Repo
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCollapse}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
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
      ) : (
        <Button
          variant="outline"
          onClick={handleExpand}
          className="flex items-center gap-2 shadow-lg"
        >
          <Github className="h-4 w-4" />
          <span>{owner || 'Select'}/{name || 'Repository'}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
