import { useContext, useEffect, useState } from "react";
import { Search } from "lucide-react";
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react";

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
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Failed to download image!</AlertTitle>
      <AlertDescription>Problem occured downloading image, metadata or URL is missing.</AlertDescription>
    </Alert>
    return;
  }
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Failed to download image!</AlertTitle>
      <AlertDescription>Problem occured downloading image, metadata or URL is missing.</AlertDescription>
    </Alert>
      return;
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
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Failed to download image!</AlertTitle>
      <AlertDescription>Problem occured downloading image, metadata or URL is missing.</AlertDescription>
    </Alert>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<NasaImageItem[]>([]);
  const [inputValue, setInputValue] = useState("space");
  const [searchTerm, setSearchTerm] = useState("space");
  const [savingFavorite, setSavingFavorite] = useState<Record<string, boolean>>({});
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

    try {
      await axios.patch("/api/auth/favorites", {
        favorite: favoriteKey,
        category: "elcovek",
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
    const fetchInitialCards = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          query: searchTerm,
          page: "1",
          pageSize: "10",
        });

        const response = await fetch(`/api/nasa/ivl/images?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch images (${response.status})`);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Debugging line
        setCards(data.images?.items ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCards();
  }, [searchTerm]);

  return (
    <div className="max-w-7xl p-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="flex flex-row items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="mb-4 text-3xl font-bold">ELCOVEK KOUSMO</h1>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-zinc-500">
              Where every snap preserved its beauty
            </p>
          </div>
          <div>
            <Button variant="default" className="cursor-pointer" onClick={() => navigate("/vibteo")}>
              VIEW THRU PRESERVED TAPES
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

        {loading && <p>Loading images...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
          {cards.map((card, index) => {
            const meta = card.data?.[0];
            const jsonUrl = card.href
            const imageUrl = card.links?.[0]?.href;
            const description = meta?.description;
            const trimmedDescription = description?.slice(0, 210) ?? "Description";

            return (
              <Card
                key={`${meta?.title ?? "image"}-${index}`}
                className="mx-auto flex w-full max-h-150 max-w-175 flex-col overflow-hidden border-0 bg-white pt-0 shadow-sm dark:bg-zinc-950"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={meta?.title ?? "NASA image"}
                    className="h-72.5 w-full object-cover brightness-100 dark:brightness-90"
                  />
                ) : null}

                <CardHeader className="flex min-h-20 flex-col gap-2 p-3">
                  <CardAction>
                    <Badge variant="secondary" className="text-[10px] mr-2">
                      {meta?.photographer || meta?.secondary_creator ? meta.photographer || meta.secondary_creator : "Image"}
                    </Badge>
                    <br />
                    <Badge variant="default" className="text-[10px]">
                      {meta?.date_created ? new Date(meta?.date_created).toLocaleDateString() : "Image"}
                    </Badge>
                  </CardAction>
                  <CardTitle className="line-clamp-2 text-sm leading-5 text-zinc-900 dark:text-zinc-100">
                    {meta?.title ?? "Astronomy Picture"}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                    {trimmedDescription ?? "Description"}{description?.length === 210 ? "......." : ""}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 mt-auto p-3 pt-0">
                  <Button
                    type="button"
                    className="h-9 w-full text-xs cursor-pointer"
                    onClick={() => handleToggleFavorite(meta?.title ?? String(index))}
                    disabled={savingFavorite[meta?.title ?? String(index)] || !auth?.user}
                  >
                    {savingFavorite[meta?.title ?? String(index)]
                      ? "Saving..."
                      : isFavorite(meta?.title ?? String(index))
                        ? "Remove favorite"
                        : "Add to favorites"}
                  </Button>
                  <Dialog>
                      <DialogTrigger render={<Button variant="default" className="h-9 w-full text-xs cursor-pointer">Open Dialog</Button>} />
                      <DialogContent className="w-[min(92vw,1000px)] max-w-none sm:max-w-350">
                        <DialogHeader>
                          <DialogTitle>{meta?.title}</DialogTitle>
                          <Separator orientation="horizontal" className="h-10 bg-black m-3" />
                          <DialogDescription className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                            <img
                              src={imageUrl}
                              alt={meta?.title ?? "NASA image"}
                              className="h-72.5 w-full object-cover brightness-100 dark:brightness-90"
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
                          <Button type="button" onClick={() => downloadImage(meta, imageUrl)}>DOWNLOAD IMAGE</Button>
                          <DialogClose render={<Button variant="outline">CLOSE</Button>} />
                        </DialogFooter>
                      </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
