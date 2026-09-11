import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardAction, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";
export const GaleriPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  const navigate = useNavigate();
  const user = useContext(AuthContext);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        const payload = res.data?.apod ?? res.data;

        if (!payload || payload.success === false) {
          throw new Error(payload?.message || "APOD payload was empty");
        }
      } catch (err) {
        console.error("Failed to fetch APOD", err);

        const message =
          typeof err === "object" && err !== null && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : undefined;

        setError(
          message ||
            (typeof err === "object" && err !== null && "message" in err
              ? String((err as { message?: string }).message)
              : "Something went wrong while fetching NASA APOD."),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);
  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center ">
          <div>
            <h1 className="mb-4 text-3xl font-bold">COLLECTIO GALLERIA</h1>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-zinc-500">
              A collection of preserved COSMICAS
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <Button
              className="w-full md:w-auto"
              variant="default"
              onClick={() => navigate("/u/profile")}
            >
              VIEW YOUR COSMICAS
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-start">
          {/*palia space*/}
          <div className="flex flex-col gap-4 items-start">
            <Button
              variant="ghost"
              className="text-amber-400 hover:text-amber-500 cursor-pointer"
            >
              Palia Andromi Galeria
              <ChevronRight />
            </Button>

            <div>
              <Card className="mx-auto flex w-full max-w-175 flex-col overflow-hidden rounded-xl border bg-white pt-0 shadow-sm dark:bg-zinc-950">
                <img
                  src=""
                  alt=""
                  className="aspect-video w-full object-cover brightness-100 dark:brightness-90"
                />
                <CardHeader className="flex min-h-20 flex-col gap-2 p-3">
                  <CardAction className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-[10px] mr-2">
                      Photographer
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      Date
                    </Badge>
                  </CardAction>
                  <CardTitle className="line-clamp-2 text-sm leading-5 text-zinc-900 dark:text-zinc-100">
                    Title
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    Description
                  </CardDescription>
                </CardHeader>

                <CardFooter className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 mt-auto p-3 pt-0">
                  {/*variant={isFavorite(favoriteKey) ? "secondary" : "default"}
                    onClick={() => handleToggleFavorite(favoriteKey)}
                    disabled={savingFavorite[favoriteKey] || !auth?.user}*/}
                  <Button
                    type="button"
                    className="h-9 w-full text-xs cursor-pointer"
                  >
                    Add to favorites
                  </Button>
                  <Dialog>
                    <DialogTrigger
                      render={
                        <Button
                          variant="default"
                          className="h-9 w-full text-xs cursor-pointer"
                        >
                          FULL DETAILS
                        </Button>
                      }
                    />
                    <DialogContent className="w-[min(92vw,1000px)] max-w-none sm:max-w-350">
                      <DialogHeader>
                        <DialogTitle>Title</DialogTitle>
                        <Separator
                          orientation="horizontal"
                          className="h-10 bg-black m-3"
                        />
                        <DialogDescription className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                          <img
                            src=""
                            alt=""
                            className="aspect-video w-full object-cover brightness-100 dark:brightness-90"
                          />
                          <div className="flex flex-col gap-2">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              description
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              photographer / creator
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              date
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              nasa id
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              center
                            </p>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <Separator
                        orientation="horizontal"
                        className="h-10 bg-black m-3"
                      />
                      <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end xl:flex-row xl:justify-center">
                        <DialogClose
                          render={<Button variant="outline">CLOSE</Button>}
                        />
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </div>
          </div>
          {/*elcovec space*/}
          <div className="flex flex-col gap-4 items-start">
            <Button
              variant="ghost"
              className="text-purple-400 hover:text-purple-500 cursor-pointer"
            >
              Palia Andromi Galeria
              <ChevronRight />
            </Button>
            <Card></Card>
          </div>
          {/*vibteo space*/}
          <div className="flex flex-col gap-4 items-start">
            <Button
              variant="ghost"
              className="text-blue-400 hover:text-blue-500 cursor-pointer"
            >
              Palia Andromi Galeria
              <ChevronRight />
            </Button>
            <Card></Card>
          </div>
        </div>
      </div>
    </div>
  );
};
