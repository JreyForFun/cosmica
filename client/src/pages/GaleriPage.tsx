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

type ApodData = {
  copyright?: string;
  title?: string;
  explanation?: string;
  url?: string;
  date?: string;
};

export const GaleriPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const user = useContext(AuthContext);

  const apodFavorites = user?.user?.favorites?.apod ?? [];
  const apodFavoritesKey = apodFavorites.join(",");

  const [cards, setCards] = useState<ApodData[]>([]);

  const favoriteApodCards = cards.filter((card) =>
    card.date ? apodFavorites.includes(card.date) : false,
  );

  useEffect(() => {
    const fetchApod = async () => {
      const favoriteDates = apodFavoritesKey ? apodFavoritesKey.split(",") : [];

      if (favoriteDates.length === 0) {
        setCards([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const responses = await Promise.all(
          favoriteDates.map((date) =>
            axios.get<{ apod?: ApodData }>("/api/nasa/apod", {
              params: { date },
            }),
          ),
        );

        const apodData = responses
          .map((response) => response.data.apod)
          .filter((card): card is ApodData => Boolean(card));

        setCards(apodData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load APOD cards.");
      } finally {
        setLoading(false);
      }
    };

    void fetchApod();
  }, [apodFavoritesKey]);

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

            {loading && (
              <p className="text-sm text-zinc-500">Loading saved APODs...</p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && !error && (
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favoriteApodCards.slice(0, 5).map((card) => (
              <Card key={card.date} className="mx-auto flex w-full max-w-175 flex-col overflow-hidden rounded-xl border bg-white pt-0 shadow-sm dark:bg-zinc-950">
                <img
                  src={card.url}
                  alt={card.title ?? "APOD"}
                  className="aspect-video w-full object-cover brightness-100 dark:brightness-90"
                />
                <CardHeader className="flex min-h-20 flex-col gap-2 p-3">
                  <CardAction className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-[10px] mr-2">
                      {card.copyright ?? "NASA"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {card.date ?? "Unknown date"}
                    </Badge>
                  </CardAction>
                  <CardTitle className="line-clamp-2 text-sm leading-5 text-zinc-900 dark:text-zinc-100">
                    {card.title ?? "Untitled APOD"}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    {card.explanation ?? "No description available."}
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
                        <DialogTitle>{card.title ?? "Untitled APOD"}</DialogTitle>
                        <Separator
                          orientation="horizontal"
                          className="h-10 bg-black m-3"
                        />
                        <DialogDescription className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                          <img
                            src={card.url}
                            alt={card.title ?? "APOD"}
                            className="aspect-video w-full object-cover brightness-100 dark:brightness-90"
                          />
                          <div className="flex flex-col gap-2">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              {card.explanation ?? "No description available."}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              {card.copyright ?? "NASA"}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              {card.date ?? "Unknown date"}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              Media type: APOD
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              NASA
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
                ))}
              </div>
            )}

            {!loading && !error && favoriteApodCards.length === 0 && (
                <p className="text-sm text-zinc-500">
                  No Palia Andromi favorites yet.
                </p>
              )}
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

          </div>
        </div>
      </div>
  );
};
