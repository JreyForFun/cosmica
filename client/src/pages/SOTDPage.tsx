import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

type ApodData = {
  copyright?: string,
  title?: string;
  explanation?: string;
  url?: string;
  hdurl?: string;
  date?: string;
  media_type?: string;
};

export const SOTDPage = () => {
  const [sotd, setSotd] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSotd = async () => {
      try {
        const res = await axios.get("/api/nasa/apod");
        const payload = res.data?.apod ?? res.data;

        if (!payload || payload.success === false) {
          throw new Error(payload?.message || "APOD payload was empty");
        }

        setSotd(payload as ApodData);
      } catch (err: unknown) {
        console.error("Failed to fetch APOD", err);

        const message =
          typeof err === "object" && err !== null && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data
                ?.message
            : undefined;

        setError(
          message ||
            (typeof err === "object" && err !== null && "message" in err
              ? String((err as { message?: string }).message)
              : "Something went wrong while fetching NASA APOD.")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSotd();
  }, []);

  const isFavorite = Boolean(
    sotd?.date && (auth?.user?.favorites ?? []).includes(sotd.date),
  );

  const handleToggleFavorite = async () => {
    if (!auth?.user || !sotd?.date) {
      return;
    }

    setSavingFavorite(true);
    setFavoriteError(null);

    try {
      await axios.patch("/api/auth/favorites", { favorite: sotd.date });
      await auth.refreshUser();
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message || "Could not update favorites."
          : "Could not update favorites.";

      setFavoriteError(message);
    } finally {
      setSavingFavorite(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-4 text-red-600">
        <h2 className="mb-2 text-xl font-bold">APOD Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!sotd) {
    return <div className="mx-auto max-w-7xl p-4">No APOD available.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
          {sotd.date || "Today"}
        </p>
        <h1 className="mb-4 text-3xl font-bold">
          {sotd.title || "Astronomy Picture of the Day"}
        </h1>
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
          {sotd.copyright
            ? `Owner of the image: ${sotd.copyright}`
            : "Astronomy Picture of the Day"}
        </p>

        {sotd.url && (
          <img
            src={sotd.url}
            alt={sotd.title || "APOD image"}
            className="mb-4 w-full rounded-lg object-contain shadow-sm max-h-[70vh] bg-zinc-100"
          />
        )}

        {sotd.explanation && (
          <div className="space-y-4 leading-7 text-zinc-700 dark:text-zinc-300">
            {sotd.explanation
              .split(/\.\s+/)
              .filter(Boolean)
              .map((paragraph, index) => {
                const text = paragraph.trim();
                const formatted = text.endsWith(".") ? text : `${text}.`;

                return (
                  <p
                    key={`${formatted}-${index}`}
                    className={
                      index === 0
                        ? "first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none"
                        : ""
                    }
                  >
                    {formatted}
                  </p>
                );
              })}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <Button
            variant={isFavorite ? "secondary" : "default"}
            onClick={handleToggleFavorite}
            disabled={savingFavorite || !auth?.user}
            className="cursor-pointer"
          >
            {savingFavorite
              ? "Saving..."
              : isFavorite
                ? "Remove from Favorites"
                : "Add to Favorites"}
          </Button>

          {favoriteError ? (
            <span className="text-sm text-red-600">{favoriteError}</span>
          ) : null}
          <Button variant={"default"} onClick={() => navigate("/palia-andromi")} className="cursor-pointer">
              SEE PAST COSMICA STARS
            </Button>
        </div>
      </div>
    </div>
  );
};