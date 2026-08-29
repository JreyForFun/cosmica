import { useLocation } from "react-router-dom"
import { SidebarTrigger } from "../ui/sidebar"

const pageTitles: Record<string, string> = {
  "/": "STAR of the Day",
  "/SOTD": "STAR of the Day",
  "/palia-andromi": "PALIA ANDROMI",
  "/elcovek": "ELCOVEK",
  "/vibteo": "VIBTEO",
  "/galeri": "GALERI",
}

export const Header = () => {
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? "Cosmica"

  return (
    <header className="flex h-15 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          August 29, 2026
        </span>
        <button className="relative p-2">🔔</button>
      </div>
    </header>
  )
}