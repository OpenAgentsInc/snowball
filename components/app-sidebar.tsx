import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader
} from "@/components/ui/sidebar"
import { SignInAndSignUpButtons } from "./auth"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SignInAndSignUpButtons />
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
