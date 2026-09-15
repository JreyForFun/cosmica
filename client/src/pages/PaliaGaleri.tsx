import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

type ApodData = {
  copyright?: string;
  title?: string;
  explanation?: string;
  url?: string;
  date?: string;
};

const EMPTY_APOD_FAVORITES: string[] = [];

export const PaliaGaleri = () => {
  const navigate = useNavigate();
  const user = useContext(AuthContext);

  const apodFavorites = user?.user?.favorites?.apod ?? EMPTY_APOD_FAVORITES;
  const favoriteDates = useMemo(() => [...new Set(apodFavorites)], [apodFavorites]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<ApodData[]>([]);
  const [search, setSearch] = useState("");

  const favoriteApodCards = useMemo(
    () =>
      cards.filter((card) =>
        card.date ? apodFavorites.includes(card.date) : false,
      ),
    [apodFavorites, cards],
  );

  const visibleCards = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return favoriteApodCards;
    }

    return favoriteApodCards.filter((card) => {
      const haystack = `${card.title ?? ""} ${card.explanation ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [favoriteApodCards, search]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!favoriteDates.length) {
        setCards([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedCards = await Promise.all(
          favoriteDates.map(async (date) => {
            const response = await axios.get<{ apod?: ApodData }>('/api/nasa/apod', {
              params: { date },
            });

            return response.data.apod ?? null;
          }),
        ).then((results) =>
          results.filter((card): card is ApodData => Boolean(card)),
        );

        setCards(
          [...fetchedCards]
            .filter((card) => card.date && apodFavorites.includes(card.date))
            .sort(
              (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
            ),
        );
      } catch (fetchError) {
        console.error("Failed to fetch favorites:", fetchError);
        setError("Failed to fetch favorites");
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchFavorites();
  }, [apodFavorites, favoriteDates]);

  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-4 text-3xl font-bold">Palia Andromi Galeria</h1>
            <Button
              variant="default"
              className="w-full cursor-pointer md:w-auto"
              onClick={() => navigate("/galeri")}
            >
              Go back to galeria
            </Button>
          </div>
          <div className="flex w-full md:w-auto">
            <Button
              variant="default"
              className="w-full cursor-pointer md:w-auto"
              onClick={() => navigate("/palia-andromi")}
            >
              Go to Palia Andromi
            </Button>
          </div>
        </div>

        <Separator />

        <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            Search favorites
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or description..."
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
          </label>
        </div>

        {loading && cards.length === 0 && (
          <p className="text-sm text-zinc-500">Loading saved Palia Andromi cards...</p>
        )}

        {!loading && error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && visibleCards.length === 0 && (
          <p className="mt-4 text-sm text-zinc-500">
            No saved APOD favorites match your search.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleCards.map((card, index) => (
            <Card
              key={`${card.date ?? index}`}
              className="mx-auto flex w-full max-w-65 flex-col overflow-hidden rounded-t-xl border-0 bg-white pt-0 shadow-sm dark:bg-zinc-950"
            >
              <img
                src={card.url || "https://avatar.vercel.sh/shadcn1"}
                alt={card.title || "APOD image"}
                className="h-47.5 w-full object-cover brightness-100 dark:brightness-90"
              />
              <CardHeader className="flex min-h-20 flex-col gap-2 p-3">
                <CardAction>
                  <Badge variant="secondary" className="text-[10px]">
                    {card.date || "Featured"}
                  </Badge>
                </CardAction>
                <CardTitle className="line-clamp-2 text-sm leading-5 text-zinc-900 dark:text-zinc-100">
                  {card.title || "Astronomy Picture"}
                </CardTitle>
              </CardHeader>
              <CardFooter className="mt-auto p-3 pt-0">
                <Button
                  type="button"
                  className="h-9 w-full text-xs"
                  onClick={() =>
                    navigate(`/cosmica/${encodeURIComponent(card.date ?? String(index))}`, {
                      state: { event: card },
                    })
                  }
                >
                  View Event
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
