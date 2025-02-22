"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SignInAndSignUpButtons } from "./auth"

const leaderboardData = [
  { username: "player1", score: 1000 },
  { username: "player2", score: 850 },
  { username: "player3", score: 720 },
]

const tools = [
  "view_file",
  "view_hierarchy", 
  "create_file",
  "rewrite_file",
  "delete_file",
  "create_pull_request",
]

export function AppSidebar() {
  return (
    <>
      {/* Left Sidebar */}
      <Sidebar side="left">
        <SidebarHeader />
        <SidebarContent>
          <SignInAndSignUpButtons />
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

      {/* Right Sidebar */}
      <Sidebar side="right">
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Available Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <Card>
                <CardHeader>
                  <CardTitle>Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tools.map((tool) => (
                      <div key={tool} className="text-sm">
                        {tool}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </>
  )
}