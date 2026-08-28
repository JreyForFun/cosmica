import { Outlet } from "react-router-dom"
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <SidebarTrigger />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}