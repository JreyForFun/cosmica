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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { User, EllipsisVertical, LogOut, Astroid, Layers2, Film, View, BookMarked, Info} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "@/context/auth-context"

const menuItems = [
  { title: "STAR of the Day", url: "/SOTD", icon: Astroid },
  { title: "PALIA ANDROMI", url: "/palia-andromi", icon: Layers2 },
  { title: "ELCOVEK", url: "/elcovek", icon: View },
  { title: "VIBTEO", url: "/vibteo", icon: Film },
  { title: "GALERI", url: "/galeri", icon: BookMarked },
]

const communityItems = [
  {title: "PROFILE", url: "/u/profile", icon: Info},
  {title: "FORUM", url: "/u/forum", icon: Info},
  {title: "ABOUT", url: "/u/chat", icon: Info},
]

export function AppSidebar() {
  const auth = useContext(AuthContext)
  const user = auth?.user
  const displayName = user?.username?.trim() || "Guest"
  const avatarLetter = displayName.charAt(0).toUpperCase()

  const handleLogout = () => {
    auth?.logout()
  }

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
          <SidebarGroupLabel>COMMUNITY</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communityItems.map((item) => (
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
      </div>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="w-full m-0">
            <Dialog>
              <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton className="flex items-center gap-3 px-2 py-6" />
                }
              >
                <Avatar className="h-9 w-9">
                  {user?.photoUrl ? (
                    <AvatarImage src={user.photoUrl} alt={displayName} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {avatarLetter}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col text-left">
                  <span className="truncate text-sm font-medium">{displayName}</span>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
                <DialogTrigger render={<DropdownMenuItem />}>
                  <User className="mr-2 h-4 w-4" />
                  Account
                </DialogTrigger>
              </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Account</DialogTitle>
                  <DialogDescription>
                    Update your profile details here.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Display Name"
                    defaultValue={displayName}
                    className="w-full border rounded p-2"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    Save Changes
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}