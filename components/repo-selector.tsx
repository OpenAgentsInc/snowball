"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function RepoSelector() {
  const [owner, setOwner] = useState("")
  const [name, setName] = useState("")
  const [branch, setBranch] = useState("main")

  const handleSubmit = () => {
    // TODO: Implement repository selection logic
    console.log({ owner, name, branch })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="owner">
              Repository Owner
            </label>
            <Input
              id="owner"
              placeholder="e.g. facebook"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Repository Name
            </label>
            <Input
              id="name"
              placeholder="e.g. react"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="branch">
              Branch
            </label>
            <Input
              id="branch"
              placeholder="e.g. main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
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
