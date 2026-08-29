import { Outlet } from "react-router-dom"
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Header } from "./header"
import { AppSidebar } from "./app-sidebar"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Header />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
