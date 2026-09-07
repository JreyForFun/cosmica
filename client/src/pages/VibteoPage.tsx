import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";


type NasaVideoItem = {
  href?: string;
  videoUrl?: string;
  data?: Array<{
    title?: string;
    description?: string;
    photographer?: string;
    secondary_creator?: string;
    date_created?: string;
    nasa_id?: string;
    center?: string;
  }>;
};

const getFileName = (item: NasaVideoItem, index: number) => {
  const id = item.data?.[0]?.nasa_id ?? `nasa-video-${index + 1}`;
  return `${id}.mp4`;
};

const downloadVideo = async (videoUrl: string | undefined, filename: string) => {
  if (!videoUrl) {
    throw new Error("This NASA result does not contain a downloadable video.");
  }

  const response = await fetch(videoUrl);
  if (!response.ok) {
    throw new Error(`The video could not be downloaded (${response.status}).`);
  }

  const blobUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
};

export const VibteoPage = () => {
  const [searchTerm, setSearchTerm] = useState("space");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<NasaVideoItem[]>([]);
  const [inputValue, setInputValue] = useState("space");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [savingFavorite, setSavingFavorite] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  const isFavorite = (favoriteKey: string) => {
    const legacyFavorites: string[] = Array.isArray(auth?.user?.favorites)
      ? (auth.user.favorites as unknown as string[])
      : [];
    const categoryFavorites = auth?.user?.favorites?.vibteo ?? [];
    return categoryFavorites.includes(favoriteKey) || legacyFavorites.includes(favoriteKey);
  };

  const handleToggleFavorite = async (favoriteKey: string) => {
    if (!auth?.user || !favoriteKey) return;

    setSavingFavorite((prev) => ({ ...prev, [favoriteKey]: true }));
    setActionError(null);

    try {
      await axios.patch("/api/auth/favorites", {
        favorite: favoriteKey,
        category: "vibteo",
      });
      await auth.refreshUser();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update favorites.");
    } finally {
      setSavingFavorite((prev) => ({ ...prev, [favoriteKey]: false }));
    }
  };

  const handleDownload = async (item: NasaVideoItem, favoriteKey: string, index: number) => {
    setDownloading((prev) => ({ ...prev, [favoriteKey]: true }));
    setActionError(null);

    try {
      await downloadVideo(item.videoUrl, getFileName(item, index));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not download the video.");
    } finally {
      setDownloading((prev) => ({ ...prev, [favoriteKey]: false }));
    }
  };

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    const nextValue = trimmed || "space";
    setInputValue(nextValue);
    setSearchTerm(nextValue);
  };

  useEffect(() => {
    const fetchVibteoItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          query: searchTerm,
          page: "1",
          pageSize: "10",
        });

        const response = await fetch(`/api/nasa/ivl/videos?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch images (${response.status})`);
        }

        const data = await response.json();
        setCards(data.videos?.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchVibteoItems();
  }, [searchTerm]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-4 text-3xl font-bold">VIBTEO</h1>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Preserved tapes from the cosmos
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <Button className="w-full md:w-auto" variant="default" onClick={() => navigate("/elcovek")}>
              VIEW PRESERVED SNAPS
            </Button>
          </div>
        </div>

        <form
          className="mb-6 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
              placeholder="Search NASA videos"
              aria-label="Search NASA videos"
            />
          </div>
          <Button type="submit" variant="default" className="shrink-0 cursor-pointer">
            Search
          </Button>
        </form>
        {loading && <p className="mb-4 text-sm text-zinc-500">Loading videos...</p>}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {actionError && <p className="mb-4 text-sm text-red-500">{actionError}</p>}
        {!loading && !error && cards.length === 0 && (
          <p className="text-sm text-zinc-500">No NASA videos matched &quot;{searchTerm}&quot;.</p>
        )}

        <div className="grid grid-cols-1 gap-6">
          {cards.map((card, index) => {
            const meta = card.data?.[0];
            const favoriteKey = meta?.nasa_id ?? card.href ?? `${meta?.title ?? "video"}-${index}`;

            return (
            <Card
              key={`${meta?.title ?? "video"}-${index}`}
              className="mx-auto flex h-auto w-full max-w-4xl flex-col overflow-hidden rounded-xl border bg-white pt-0 shadow-sm dark:bg-zinc-950"
            >
              {card.videoUrl ? (
                <video
                  src={card.videoUrl}
                  aria-label={meta?.title ?? "NASA video"}
                  controls
                  preload="metadata"
                  className="max-h-[70vh] w-full bg-black object-contain"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-800">
                  Video preview unavailable
                </div>
              )}

              <CardHeader className="flex min-h-20 flex-col gap-3 p-4">
                <CardAction className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {meta?.photographer || meta?.secondary_creator || "Unknown creator"}
                  </Badge>
                  {meta?.date_created && (
                    <Badge variant="outline" className="text-[10px]">
                      {new Date(meta.date_created).toLocaleDateString()}
                    </Badge>
                  )}
                  {meta?.center && <Badge variant="outline" className="text-[10px]">{meta.center}</Badge>}
                </CardAction>
                <CardTitle className="line-clamp-2 text-xl leading-6 text-zinc-900 dark:text-zinc-100">
                    {meta?.title ?? "UNKNOWN TITLE"}
                  </CardTitle>
                <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                    {meta?.description ?? "No description available for this NASA result."}
                  </CardDescription>

              </CardHeader>

              <Separator />
              <CardFooter className="grid grid-cols-1 gap-2 p-4 pt-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={isFavorite(favoriteKey) ? "secondary" : "default"}
                  className="h-9 w-full text-xs"
                  onClick={() => handleToggleFavorite(favoriteKey)}
                  disabled={savingFavorite[favoriteKey] || !auth?.user}
                >
                  {savingFavorite[favoriteKey]
                    ? "Saving..."
                    : isFavorite(favoriteKey)
                      ? "Remove favorite"
                      : "Add to favorites"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full text-xs"
                  onClick={() => handleDownload(card, favoriteKey, index)}
                  disabled={downloading[favoriteKey] || !card.videoUrl}
                >
                  {downloading[favoriteKey] ? "Downloading..." : "Download video"}
                </Button>
              </CardFooter>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};