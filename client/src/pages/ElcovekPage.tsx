import { useCallback,useContext, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator";

type NasaImageItem = {
  href?: string;
  data?: Array<{ title?: string; description?: string , photographer?: string; secondary_creator?: string; date_created?: string; nasa_id?: string, center?: string }>;
  links?: Array<{ href?: string }>;
};

type NasaMetadata = {
  title?: string;
  description?: string;
  photographer?: string;
  secondary_creator?: string;
  date_created?: string;
  nasa_id?: string;
  center?: string;
};

const downloadImage = async (meta: NasaMetadata | undefined, imageUrl: string | undefined) => {
  if (!meta || !imageUrl) {
    throw new Error("Image metadata or URL is missing.");
  }
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`The image could not be downloaded (${response.status}).`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `${meta?.nasa_id || meta?.title || "image"}${getImageExtension(imageUrl)}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    throw error instanceof Error ? error : new Error("Could not download the image.");
  }
};

const getImageExtension = (url: string): string => {
  const match = url.match(/\.[0-9a-z]+(?=(\?|$))/i);
  return match ? match[0] : ".jpg";
};

const downloadFile = async (fileUrl: string | undefined, filename: string) => {
  if (!fileUrl) {
    alert(`${filename} not available`);
    return;
  }
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download ${filename}`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    alert(`Failed to download ${filename}`);
  }
};

export const ElcovekPage = () => {
  const PAGE_SIZE = 10;

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<NasaImageItem[]>([]);
  const [inputValue, setInputValue] = useState("space");
  const [searchTerm, setSearchTerm] = useState("space");
  const [savingFavorite, setSavingFavorite] = useState<Record<string, boolean>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const isFavorite = (favoriteKey: string) => {
    const legacyFavorites: string[] = Array.isArray(auth?.user?.favorites)
      ? (auth.user.favorites as unknown as string[])
      : [];
    const categoryFavorites = auth?.user?.favorites?.elcovek ?? [];
    return categoryFavorites.includes(favoriteKey) || legacyFavorites.includes(favoriteKey);
  };

  const handleToggleFavorite = async (favoriteKey: string) => {
    if (!auth?.user || !favoriteKey) return;

    setSavingFavorite((prev) => ({ ...prev, [favoriteKey]: true }));
    setActionError(null);

    try {
      await axios.patch("/api/auth/favorites", {
        favorite: favoriteKey,
        category: "elcovek",
      });
      await auth.refreshUser();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update favorites.");
    } finally {
      setSavingFavorite((prev) => ({ ...prev, [favoriteKey]: false }));
    }
  };

  const handleDownloadImage = async (meta: NasaMetadata | undefined, imageUrl: string | undefined) => {
    setActionError(null);

    try {
      await downloadImage(meta, imageUrl);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not download the image.");
    }
  };

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    const nextValue = trimmed || "space";
    setInputValue(nextValue);
    setSearchTerm(nextValue);
  };

  const fetchPage = useCallback(
    async (pageNumber: number, replaceCards: boolean) => {
      if(replaceCards){
        setCards([]);
        setPage(0);
        setHasMore(true);
        setLoadMoreError(null);
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
        setLoadMoreError(null);
      }

      try {
        const params = new URLSearchParams({
          query: searchTerm,
          page: String(pageNumber),
          pageSize: String(PAGE_SIZE),
        });

        const response = await axios.get(
          `/api/nasa/ivl/images?${params.toString()}`
        );

        if(!response.data.success){
          throw new Error("Failed to fetch images.");
        }

        const data = response.data;
        const result = data.images;
        const nextItems = result?.items ?? [];

        setCards((previousCards) => {
        if (replaceCards) {
          return nextItems;
        }

        return [...previousCards, ...nextItems];
      });

      setPage(pageNumber);
      setHasMore(Boolean(result?.hasMore));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not fetch images.";
        if (replaceCards) {
          setError(message);
        } else {
          setLoadMoreError(message);
        }
      } finally {
        if(replaceCards){
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [searchTerm]
  );

  const handleLoadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    void fetchPage(page + 1, false);
  }, [fetchPage, hasMore, loading, loadingMore, page]);

  const sentinelRef = useInfiniteScroll({
    loading: loading || loadingMore,
    hasMore,
    onLoadMore: handleLoadMore,
  });

  useEffect(() => {
    const requestId = window.setTimeout(() => {
      void fetchPage(1, true);
    }, 0);

    return () => window.clearTimeout(requestId);
  }, [searchTerm, fetchPage]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-4 text-3xl font-bold">ELCOVEK KOUSMO</h1>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Where every snap preserved its beauty
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <Button variant="default" className="w-full cursor-pointer md:w-auto" onClick={() => navigate("/vibteo")}>
              VIEW THRU PRESERVED TAPES
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
              placeholder="Search NASA images"
              aria-label="Search NASA images"
            />
          </div>
          <Button type="submit" variant="default" className="shrink-0 cursor-pointer">
            Search
          </Button>
        </form>

        {loading && <p className="mb-4 text-sm text-zinc-500">Loading images...</p>}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {actionError && <p className="mb-4 text-sm text-red-500">{actionError}</p>}
        {!loading && !error && cards.length === 0 && (
          <p className="text-sm text-zinc-500">No NASA images matched &quot;{searchTerm}&quot;.</p>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {cards.map((card, index) => {
            const meta = card.data?.[0];
            const jsonUrl = card.href
            const imageUrl = card.links?.[0]?.href;
            const favoriteKey = meta?.nasa_id ?? meta?.title ?? `image-${index}`;
            const description = meta?.description;
            const trimmedDescription = description?.slice(0, 210) ?? "Description";

            return (
              <Card
                key={`${meta?.title ?? "image"}-${index}`}
                className="mx-auto flex w-full max-w-175 flex-col overflow-hidden rounded-xl border bg-white pt-0 shadow-sm dark:bg-zinc-950"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={meta?.title ?? "NASA image"}
                    className="aspect-video w-full object-cover brightness-100 dark:brightness-90"
                  />
                ) : null}

                <CardHeader className="flex min-h-20 flex-col gap-2 p-3">
                  <CardAction className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-[10px] mr-2">
                      {meta?.photographer || meta?.secondary_creator ? meta.photographer || meta.secondary_creator : "Image"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {meta?.date_created ? new Date(meta?.date_created).toLocaleDateString() : "Image"}
                    </Badge>
                  </CardAction>
                  <CardTitle className="line-clamp-2 text-sm leading-5 text-zinc-900 dark:text-zinc-100">
                    {meta?.title ?? "Astronomy Picture"}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    {trimmedDescription}{description && description.length > 210 ? "..." : ""}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 mt-auto p-3 pt-0">
                  <Button
                    type="button"
                    className="h-9 w-full text-xs cursor-pointer"
                    variant={isFavorite(favoriteKey) ? "secondary" : "default"}
                    onClick={() => handleToggleFavorite(favoriteKey)}
                    disabled={savingFavorite[favoriteKey] || !auth?.user}
                  >
                    {savingFavorite[favoriteKey]
                      ? "Saving..."
                      : isFavorite(favoriteKey)
                        ? "Remove favorite"
                        : "Add to favorites"}
                  </Button>
                  <Dialog>
                      <DialogTrigger render={<Button variant="default" className="h-9 w-full text-xs cursor-pointer">FULL DETAILS</Button>} />
                      <DialogContent className="w-[min(92vw,1000px)] max-w-none sm:max-w-350">
                        <DialogHeader>
                          <DialogTitle>{meta?.title}</DialogTitle>
                          <Separator orientation="horizontal" className="h-10 bg-black m-3" />
                          <DialogDescription className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                            <img
                              src={imageUrl}
                              alt={meta?.title ?? "NASA image"}
                              className="aspect-video w-full object-cover brightness-100 dark:brightness-90"
                            />
                            <div className="flex flex-col gap-2">
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {description ? (
                                <>
                                  <strong>Description: </strong> {description}
                                </>
                              ) : (
                                "Description"
                              )}
                              </p>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {meta?.photographer || meta?.secondary_creator ? (
                                  <>
                                    <strong>Photographer: </strong> {meta?.photographer || meta?.secondary_creator}
                                  </>
                                ) : "Unknown Photographer / Creator"}
                              </p>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {meta?.date_created ? (
                                  <>
                                    <strong>Date Created: </strong> {new Date(meta?.date_created).toLocaleDateString()}
                                  </>
                                ) : null}
                              </p>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {meta?.nasa_id ? (
                                  <>
                                    <strong>NASA ID: </strong> {meta?.nasa_id}
                                  </>
                                ) : null}
                              </p>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {meta?.center ? (
                                  <>
                                    <strong>Center: </strong> {meta?.center}
                                  </>
                                ) : null}
                              </p>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                        <Separator orientation="horizontal" className="h-10 bg-black m-3" />
                        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end xl:flex-row xl:justify-center">
                          <Button type="button" onClick={() => downloadFile(jsonUrl, `${meta?.nasa_id || "image"}.json`)}>DOWNLOAD DATA (JSON)
                            </Button>
                          <Button type="button" onClick={() => handleDownloadImage(meta, imageUrl)}>DOWNLOAD IMAGE</Button>
                          <DialogClose render={<Button variant="outline">CLOSE</Button>} />
                        </DialogFooter>
                      </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div ref={sentinelRef} className="h-10" aria-hidden="true" />

        {loadingMore && (
          <p className="mt-6 text-center text-sm text-zinc-500">
            Loading more images...
          </p>
        )}

        {loadMoreError && (
          <div className="mt-6 text-center">
            <p className="text-sm text-red-500">{loadMoreError}</p>
            <Button type="button" variant="outline" onClick={handleLoadMore} className="mt-2">
              Try again
            </Button>
          </div>
        )}

        {!hasMore && cards.length > 0 && (
          <p className="mt-6 text-center text-sm text-zinc-500">
            You reached the end of the image collection.
          </p>
        )}
      </div>
    </div>
  );
};
