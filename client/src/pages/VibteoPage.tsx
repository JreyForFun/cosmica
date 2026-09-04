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
  data?: Array<{ title?: string; description?: string , photographer?: string; secondary_creator?: string; date_created?: string; nasa_id?: string, center?: string }>;
  links?: Array<{ href?: string }>;
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

    try {
      await axios.patch("/api/auth/favorites", {
        favorite: favoriteKey,
        category: "vibteo",
      });
      await auth.refreshUser();
    } finally {
      setSavingFavorite((prev) => ({ ...prev, [favoriteKey]: false }));
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
        console.log("Fetched data:", data); // Debugging line
        setCards(data.videos?.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchVibteoItems();
  }, [searchTerm]);

  return (
    <div className="max-w-7xl p-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="mb-4 flex flex-row items-center justify-between gap-4">
          <div>
            <h1 className="mb-4 text-3xl font-bold">VIBTEO</h1>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Preserved tapes from the cosmos
            </p>
          </div>
          <div>
            <Button variant="default" onClick={() => navigate("/elcovek")}>
              VIEW THRU SNAPS PRESERVED SNAPS
            </Button>
          </div>
        </div>

        <form
                  className="mb-4 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                >
                  <div className="relative w-50">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearch();
                        }
                      }}
                      className="w-full border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400"
                      placeholder="Search NASA images"
                    />
                  </div>
                  <Button type="submit" variant="default" className="shrink-0 cursor-pointer">
                    Search
                  </Button>
                </form>
                {loading && <p>Loading videos...</p>}
                {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
          {cards.map((card, index) => {
            const meta = card.data?.[0];
            const favoriteKey = meta?.nasa_id ?? card.href ?? `${meta?.title ?? "video"}-${index}`;

            return (
            <Card
              key={`${meta?.title ?? "video"}-${index}`}
              className="mx-auto flex w-full h-auto flex-col overflow-hidden rounded-t-xl border-0 bg-white pt-0 shadow-sm dark:bg-zinc-950"
            >
              <video
                src={card.videoUrl}
                aria-label={meta?.title ?? "NASA video"}
                controls
                className="h-auto w-full object-cover brightness-100 dark:brightness-90"
              />
              <Separator orientation="horizontal" className="h-10 bg-black" />

              <CardHeader className="flex min-h-20 flex-col gap-2 p-3">
                <CardAction>
                  <Badge variant="secondary" className="text-[10px]">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {meta?.photographer || meta?.secondary_creator ? (
                                  <>
                                    <strong>Photographer: </strong> {meta?.photographer || meta?.secondary_creator}
                                  </>
                                ) : "Unknown Photographer / Creator"}
                              </p>
                  </Badge>
                  <br />
                  <Badge variant="default" className="text-[10px]">
                   <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {meta?.date_created ? (
                                  <>
                                    <strong>Date Created: </strong> {new Date(meta?.date_created).toLocaleDateString()}
                                  </>
                                ) : null}
                              </p>
                  </Badge>
                  <br />
                  <Badge variant="default" className="text-[10px]">
                   <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {meta?.nasa_id ? (
                                  <>
                                    <strong>NASA ID: </strong> {meta?.nasa_id}
                                  </>
                                ) : null}
                              </p>
                  </Badge>
                  <br />
                  <Badge variant="default" className="text-[10px]">
                   <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {meta?.center ? (
                                  <>
                                    <strong>Center: </strong> {meta?.center}
                                  </>
                                ) : null}
                              </p>
                  </Badge>
                </CardAction>
                <CardTitle className="line-clamp-2 text-xl leading-5 text-zinc-900 dark:text-zinc-100">
                    {meta?.title ?? "UNKNOWN TITLE"}
                  </CardTitle>
                <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                    {meta?.description ?? "No description."}
                    
                              
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {meta?.center ? (
                                  <>
                                    <strong>Center: </strong> {meta?.center}
                                  </>
                                ) : null}
                              </p>
                  </CardDescription>

              </CardHeader>

              <Separator orientation="horizontal" className="h-10 bg-black" />
              <CardFooter className="grid grid-cols-2 gap-2 mt-auto p-3 pt-0">
                <Button
                  type="button"
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
                className="h-9 w-full text-xs">
                  {savingFavorite[favoriteKey]
                    ? "Saving..."
                    : isFavorite(favoriteKey)
                      ? "Remove favorite"
                      : "Download the video"}
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