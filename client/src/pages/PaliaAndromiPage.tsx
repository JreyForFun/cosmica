import { useEffect, useState } from "react";
import { useNavigate,  } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ApodData = {
  copyright?: string;
  title?: string;
  explanation?: string;
  url?: string;
  hdurl?: string;
  date?: string;
  media_type?: string;
};

const PAGE_SIZE = 12;

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const getRange = (days: number) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

const getOldestDate = (items: ApodData[]) => {
  const validDates = items
    .map((item) => item.date)
    .filter((date): date is string => Boolean(date))
    .map((date) => new Date(date).getTime());

  return validDates.length ? new Date(Math.min(...validDates)) : null;
};

export const PaliaAndromi = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<ApodData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialCards = async () => {
      try {
        setLoading(true);
        setError(null);

        const range = getRange(PAGE_SIZE - 1);
        const response = await fetch(
          `/api/nasa/apod/range?startDate=${range.startDate}&endDate=${range.endDate}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch cards");
        }

        const apodData = Array.isArray(data?.apod) ? data.apod : [];
        const newestFirst = [...apodData].sort(
          (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
        );

        setCards(newestFirst.slice(0, PAGE_SIZE));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch cards");
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCards();
  }, []);

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      setError(null);

      const oldestDate = getOldestDate(cards);
      if (!oldestDate) {
        setLoading(false);
        return;
      }

      const endDate = new Date(oldestDate);
      endDate.setDate(endDate.getDate() - 1);

      const startDate = new Date(oldestDate);
      startDate.setDate(startDate.getDate() - PAGE_SIZE);

      const response = await fetch(
        `/api/nasa/apod/range?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load more cards");
      }

      const apodData = Array.isArray(data?.apod) ? data.apod : [];
      const nextItems = [...apodData]
        .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
        .filter((item) => !cards.some((existing) => existing.date === item.date));

      setCards((prev) => [...prev, ...nextItems]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more cards");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl p-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="flex flex-rows justify-between items-center mb-4">
          <div>
            <h1 className="mb-4 text-3xl font-bold">Palia Andromi</h1>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Where past stars gather to show it's cosmica
            </p>
          </div>
          <div>
             <div>
            <Button variant={"default"} onClick={() => navigate("/SOTD")}>
              GO TO CURRENT STAR OF THE DAY
            </Button>
          </div>
          </div>
        </div>
        {loading && cards.length === 0 && (
          <p className="text-sm text-zinc-500">Loading Palia Andromi Cards...</p>
        )}

        {!loading && error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card, index) => (
            <Card
              key={`${card.date ?? index}`}
              className="mx-auto flex w-full max-w-[260px] flex-col overflow-hidden rounded-t-xl border-0 bg-white pt-0 shadow-sm dark:bg-zinc-950"
            >
              <img
                src={card.url || "https://avatar.vercel.sh/shadcn1"}
                alt={card.title || "APOD image"}
                className="h-[190px] w-full object-cover brightness-100 dark:brightness-90"
              />
              <CardHeader className="flex min-h-[80px] flex-col gap-2 p-3">
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

        {!loading && cards.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button onClick={handleLoadMore} variant="outline">
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};