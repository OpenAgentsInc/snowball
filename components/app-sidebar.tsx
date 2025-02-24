"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader
} from "@/components/ui/sidebar"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { SignInAndSignUpButtons } from "./auth"
import { RepoSelector } from "./repo-selector"

const leaderboardData = [
  { username: "player1", score: 1000 },
  { username: "player2", score: 850 },
  { username: "player3", score: 720 },
]

export function LeftSidebar() {
  return (
    <Sidebar side="left">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Leaderboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <Card>
              <CardHeader>
                <CardTitle>Top Players</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((player) => (
                      <TableRow key={player.username}>
                        <TableCell>{player.username}</TableCell>
                        <TableCell>{player.score}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export function RightSidebar() {
  return (
    <Sidebar side="right">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Repository</SidebarGroupLabel>
          <SidebarGroupContent>
            <RepoSelector />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export function AuthButtons() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <SignInAndSignUpButtons />
    </div>
  )
}
