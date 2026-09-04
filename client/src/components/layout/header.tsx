import { useLocation} from "react-router-dom"
import { SidebarTrigger } from "../ui/sidebar"
import { SunDim, MoonStar } from "lucide-react"
import { useEffect, useState } from "react"

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
  const title = pageTitles[location.pathname] ?? "Cosmica";
  const [time, setTime] = useState(new Date());
  const currentHourIdentifyIcon = new Date().getHours();
  const isDay = currentHourIdentifyIcon >= 6 && currentHourIdentifyIcon < 18;
  useEffect(() => {
    // Update every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup when component unmounts
    return () => clearInterval(timer);
  }, []);

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
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
        </span>
        <h1>{isDay ? <SunDim /> : <MoonStar />}</h1>
      </div>
    </header>
  )
}