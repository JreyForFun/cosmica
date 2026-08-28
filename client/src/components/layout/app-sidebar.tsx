import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Settings, User } from "lucide-react"
import { NavLink } from "react-router-dom"

const menuItems = [
  { title: "STAR of the Day", url: "/SOTD", icon: Home },
  { title: "PALIA ANDROMI", url: "/palia-andromi", icon: User },
  { title: "ELCOVEK", url: "/elcovek", icon: Settings },
 { title: "VIBTEO", url: "/vibtea", icon: Settings },
  { title: "GALERI", url: "/galeri", icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-3 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 10A6.06 6.06 0 0 1 12 10 A6.06 6.06 0 0 0 21 10" />
            <path d="M6 3v12a6 6 0 0 0 12 0V3" />
          </svg>
          <span className="font-heading text-lg">Cosmica</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ARCHIVES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<NavLink to={item.url} />}>
                    <item.icon />
                    <span className="p-4 text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <span className="px-3 py-2 text-xs text-sidebar-foreground/60">
          Your workspace
        </span>
      </SidebarFooter>
    </Sidebar>
  )
}