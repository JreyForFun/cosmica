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

type NasaImageItem = {
  data?: Array<{
    nasa_id?: string;
    title?: string;
    description?: string;
    photographer?: string;
    date_created?: string;
    center?: string;
  }>;
  links?: Array<{ href?: string }>;
};

type NasaVideoItem = {
  videoUrl?: string;
  data?: Array<{
    nasa_id?: string;
    title?: string;
    description?: string;
    date_created?: string;
    center?: string;
  }>;
};

export const GaleriPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const user = useContext(AuthContext);

  const apodFavorites = user?.user?.favorites?.apod ?? [];
  const apodFavoritesKey = apodFavorites.join(",");
  const imageFavoriteIds = user?.user?.favorites?.elcovek ?? [];
  const imageFavoritesKey = imageFavoriteIds.join(",");
  const videoFavoriteIds = user?.user?.favorites?.vibteo ?? [];
  const videoFavoritesKey = videoFavoriteIds.join(",");


  const [cards, setCards] = useState<ApodData[]>([]);
  const [imageCards, setImageCards] = useState<NasaImageItem[]>([]);
  const [videoCards, setVideoCards] = useState<NasaVideoItem[]>([]);

  const favoriteApodCards = cards.filter((card) =>
    card.date ? apodFavorites.includes(card.date) : false,
  );

  const favoriteImages = imageCards.filter((card) => {
  const nasaId = card.data?.[0]?.nasa_id;

  return nasaId ? imageFavoriteIds.includes(nasaId) : false;
});

  const favoriteVideos = videoCards.filter((card) => {
    const nasaId = card.data?.[0]?.nasa_id;

    return nasaId ? videoFavoriteIds.includes(nasaId) : false;
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      const favoriteDates = apodFavoritesKey ? apodFavoritesKey.split(",") : [];
      const favoriteImageIds = imageFavoritesKey ? imageFavoritesKey.split(",") : [];
      const favoriteVideoIds = videoFavoritesKey ? videoFavoritesKey.split(",") : [];

      setLoading(true);
      setError(null);

      try {
        const apodPromise: Promise<ApodData[]> = favoriteDates.length === 0
          ? Promise.resolve([])
          : Promise.all(
              favoriteDates.map(async (date) => {
                const response = await axios.get<{ apod?: ApodData }>("/api/nasa/apod", {
                  params: { date },
                });
                return response.data.apod;
              }),
            ).then((responses) =>
              responses.filter((card): card is ApodData => Boolean(card)),
            );

        const imagePromise: Promise<NasaImageItem[]> = favoriteImageIds.length === 0
          ? Promise.resolve([])
          : axios
              .get<{ images?: { items?: NasaImageItem[] } }>("/api/nasa/ivl/images", {
                params: { query: "space", page: 1, pageSize: 100 },
              })
              .then((response) => response.data.images?.items ?? []);

        const videoPromise: Promise<NasaVideoItem[]> = favoriteVideoIds.length === 0
          ? Promise.resolve([])
          : axios
              .get<{ videos?: { items?: NasaVideoItem[] } }>("/api/nasa/ivl/videos", {
                params: { query: "space", page: 1, pageSize: 100 },
              })
              .then((response) => response.data.videos?.items ?? []);

        const [apodData, imageData, videoData] = await Promise.all([
          apodPromise,
          imagePromise,
          videoPromise,
        ]);

        setCards(apodData);
        setImageCards(imageData);
        setVideoCards(videoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load favorites.");
      } finally {
        setLoading(false);
      }
    };

    void fetchFavorites();
  }, [apodFavoritesKey, imageFavoritesKey, videoFavoritesKey]);

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
              variant="default"
              className="text-amber-400 hover:text-amber-500 cursor-pointer"
              onClick={() => navigate("/galeri/palia-andromi")}
            >
              Palia Andromi Galeria
              <ChevronRight />
            </Button>

            {loading && (
              <p className="text-sm text-zinc-500">Loading saved APODs...</p>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            {!loading && !error && (
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                {favoriteApodCards.slice(0, 5).map((card) => (
              <Card key={card.date} className="mx-auto flex h-full w-full max-w-175 flex-col overflow-hidden border bg-white pt-0 shadow-sm dark:bg-zinc-950">
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
                    <span className="line-clamp-3">
                      {card.explanation ?? "No description available."}
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardFooter className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 mt-auto p-1 pt-0">
                  <Dialog>
                    <DialogTrigger render={<Button className="h-9 w-full text-xs mx=auto">VIEW DETAILS</Button>} />
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
                              {card.explanation
                                ? card.explanation.substring(0, 50)
                                : "No description available."}
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
          <div className="flex flex-col gap-4 items-start mt-13">
            <Button
              variant="default"
              className="text-purple-400 hover:text-purple-500 cursor-pointer"
              onClick={() => navigate("/galeri/elcovek")}
            >
              Elcovek Galeria
              <ChevronRight />
            </Button>
            {loading && (
              <p className="text-sm text-zinc-500">Loading saved Elcoveks...</p>
            )}
            {!loading && !error && (
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {favoriteImages.slice(0, 4).map((card) => {
                  const metadata = card.data?.[0];
                  const imageUrl = card.links?.[0]?.href;
                  const nasaId = metadata?.nasa_id;

                  return (
                    <Card key={nasaId} className="mx-auto flex h-full w-full max-w-175 flex-col overflow-hidden border bg-white pt-0 shadow-sm dark:bg-zinc-950">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={metadata?.title ?? "NASA image"}
                          className="aspect-video w-full object-cover brightness-100 dark:brightness-90"
                        />
                      )}
                      <CardHeader className="flex min-h-20 flex-col gap-2 p-3">
                        <CardAction className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {metadata?.photographer ?? "NASA"}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {metadata?.date_created ?? "Unknown date"}
                          </Badge>
                        </CardAction>
                        <CardTitle className="line-clamp-2 text-sm">
                          {metadata?.title ?? "Untitled image"}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-xs">
                          {metadata?.description ?? "No description available."}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto p-1 pt-0">
                        <Dialog>
                          <DialogTrigger render={<Button className="h-9 w-full text-xs mx-auto">VIEW DETAILS</Button>} />
                          <DialogContent className="w-[min(92vw,1000px)] max-w-none sm:max-w-350">
                            <DialogHeader>
                              <DialogTitle>{metadata?.title ?? "Untitled image"}</DialogTitle>
                              <DialogDescription className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {imageUrl && (
                                  <img src={imageUrl} alt={metadata?.title ?? "NASA image"} className="aspect-video w-full object-cover" />
                                )}
                                <div className="flex flex-col gap-2 text-sm text-zinc-500">
                                  <p>{metadata?.description ?? "No description available."}</p>
                                  <p>{metadata?.photographer ?? "NASA"}</p>
                                  <p>{metadata?.date_created ?? "Unknown date"}</p>
                                  <p>NASA ID: {nasaId ?? "Unknown"}</p>
                                  <p>Center: {metadata?.center ?? "Unknown"}</p>
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose render={<Button variant="outline">CLOSE</Button>} />
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
            {!loading && !error && favoriteImages.length === 0 && (
              <p className="text-sm text-zinc-500">No Elcovek favorites yet.</p>
            )}
          </div>
          {/*vibteo space*/}
          <div className="flex flex-col gap-4 items-start mt-17">
            <Button
              variant="default"
              className="text-blue-400 hover:text-blue-500 cursor-pointer"
              onClick={() => navigate("/galeri/vibteo")}
            >
              Vibteo Galeria
              <ChevronRight />
            </Button>
            {loading && (
              <p className="text-sm text-zinc-500">Loading saved Vibteos...</p>
            )}
            {!loading && !error && (
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {favoriteVideos.slice(0, 5).map((card) => {
                  const metadata = card.data?.[0];
                  const nasaId = metadata?.nasa_id;

                  return (
                    <Card key={nasaId} className="mx-auto flex h-full w-full max-w-175 flex-col overflow-hidden border bg-white pt-0 shadow-sm dark:bg-zinc-950">
                      {card.videoUrl && (
                        <video src={card.videoUrl} controls className="aspect-video w-full object-cover brightness-100 dark:brightness-90" />
                      )}
                      <CardHeader className="flex min-h-20 flex-col gap-2 p-3">
                        <CardAction className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-[10px]">NASA</Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {metadata?.date_created ?? "Unknown date"}
                          </Badge>
                        </CardAction>
                        <CardTitle className="line-clamp-2 text-sm">
                          {metadata?.title ?? "Untitled video"}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 text-xs">
                          {metadata?.description ?? "No description available."}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto p-1 pt-0">
                        <Dialog>
                          <DialogTrigger render={<Button className="h-9 w-full text-xs">VIEW DETAILS</Button>} />
                          <DialogContent className="w-[min(92vw,1000px)] max-w-none sm:max-w-350">
                            <DialogHeader>
                              <DialogTitle>{metadata?.title ?? "Untitled video"}</DialogTitle>
                              <DialogDescription className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {card.videoUrl && (
                                  <video src={card.videoUrl} controls className="aspect-video w-full object-cover" />
                                )}
                                <div className="flex flex-col gap-2 text-sm text-zinc-500">
                                  <p>{metadata?.description ?? "No description available."}</p>
                                  <p>{metadata?.date_created ?? "Unknown date"}</p>
                                  <p>NASA ID: {nasaId ?? "Unknown"}</p>
                                  <p>Center: {metadata?.center ?? "Unknown"}</p>
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose render={<Button variant="outline">CLOSE</Button>} />
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
            {!loading && !error && favoriteVideos.length === 0 && (
              <p className="text-sm text-zinc-500">No Vibteo favorites yet.</p>
            )}
          </div>
        </div>
      </div>
  );
};
