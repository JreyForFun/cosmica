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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { EllipsisVertical, Home, Settings, User } from "lucide-react"
import { NavLink } from "react-router-dom"

const menuItems = [
  { title: "STAR of the Day", url: "/SOTD", icon: Home },
  { title: "PALIA ANDROMI", url: "/palia-andromi", icon: User },
  { title: "ELCOVEK", url: "/elcovek", icon: Settings },
  { title: "VIBTEO", url: "/vibteo", icon: Settings },
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

      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ARCHIVES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<NavLink to={item.url} />} className="py-8">
                    <item.icon className="h-20 w-20 " strokeWidth={1.5}/>
                    <span className="p-4 text-sm font-semibold">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <div>
        <SidebarGroup>
          <SidebarGroupLabel>OTHERS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<NavLink to="/about" />} className="py-8">
                  <Settings className="h-20 w-20 " strokeWidth={1.5}/>
                  <span className="p-4 text-sm font-semibold">About Cosmica</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="w-full m-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton className="flex items-center gap-4 px-2 py-6" />
                }
              >
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span>John Rey</span>
                  <span className="text-xs text-muted-foreground">
                    Explorer Tier
                  </span>
                </div>
                <EllipsisVertical className="size-4 ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}