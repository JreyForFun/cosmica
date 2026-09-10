import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
export const GaleriPage = () => {


  const navigate = useNavigate()
  return (
    <div className="mx-auto w-full max-w-7xl p-4">
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center ">
              <div>
                <h1 className="mb-4 text-3xl font-bold">COLLECTIO GALLERIA</h1>
                <p className="mb-4 text-sm uppercase tracking-[0.2em] text-zinc-500">
                  A collection of preserved COSMICAS from the past. 
                </p>
              </div>
              <div className="flex w-full md:w-auto">
                <Button className="w-full md:w-auto" variant="default" onClick={() => navigate("/u/profile")}>
                  VIEW YOUR COSMICAS
                </Button>
              </div>
            </div>
          </div>
    </div>
  )
}