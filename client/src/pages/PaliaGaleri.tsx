import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const PaliaGaleri = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
    const navigate = useNavigate();
    const user = useContext(AuthContext);
  return (
    <div className="w-fullmx-auto max-w-7xl p-4">
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h1 className="mb-4 text-3xl font-bold">Palia Andromi Galeria</h1>
                  <Button variant="default" className="w-full cursor-pointer md:w-auto" onClick={() => navigate("/galeri")}>
                    Go back to galeria
                  </Button>
                </div>
                <div className="flex w-full md:w-auto">
                  <Button variant="default" className="w-full cursor-pointer md:w-auto" onClick={() => navigate("/palia-andromi")}>
                    Go to Palia Andromi
                  </Button>
                </div>
              </div>
              <Separator/>
    </div>
    </div>
  )
}