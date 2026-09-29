import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import axios from "axios";

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

const EMPTY_FAVORITE_IDS: string[] = [];

export const CosmicaDetailNI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const auth = useContext(AuthContext);

  const [event, setEvent] = useState<NasaImageItem | null>(
    (location.state as { event?: NasaImageItem } | null)?.event ?? null,
  );
  const [loading, setLoading] = useState(!event && Boolean(id));
  const [error, setError] = useState<string | null>(null);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  const meta = useMemo(() => event?.data?.[0], [event]);
  const imageUrl = event?.links?.[0]?.href ?? "";
  const isFavorite = Boolean(
    meta?.nasa_id && (auth?.user?.favorites?.elcovek ?? EMPTY_FAVORITE_IDS).includes(meta.nasa_id),
  );

  useEffect(() => {
    if (event || !id) {
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<{ images?: { items?: NasaImageItem[] } }>('/api/nasa/ivl/images', {
          params: { query: 'space', page: 1, pageSize: 100 },
        });

        const item = (response.data.images?.items ?? []).find(
          (card) => card.data?.[0]?.nasa_id === decodeURIComponent(id),
        );

        setEvent(item ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    void fetchEvent();
  }, [event, id]);

  const handleToggleFavorite = async () => {
    if (!auth?.user || !meta?.nasa_id) {
      return;
    }

    setSavingFavorite(true);
    setFavoriteError(null);

    try {
      await axios.patch('/api/auth/favorites', {
        favorite: meta.nasa_id,
        category: 'elcovek',
      });
      await auth.refreshUser();
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Could not update favorites.')
          : 'Could not update favorites.';

      setFavoriteError(message);
    } finally {
      setSavingFavorite(false);
    }
  };

  const handleOpenImage = () => {
    if (!imageUrl) {
      return;
    }

    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl p-6">Loading event...</div>;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">{error}</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  if (!event || !meta) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p>No event found.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4">
      <div className="mb-4 flex flex-row items-center justify-between gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>

        <Button
          variant={isFavorite ? 'secondary' : 'default'}
          onClick={handleToggleFavorite}
          disabled={savingFavorite || !auth?.user}
        >
          {savingFavorite ? 'Saving...' : isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </div>

      {favoriteError ? (
        <p className="mb-4 text-sm text-red-600">{favoriteError}</p>
      ) : null}

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
          {meta.date_created || 'Featured'}
        </p>

        <h1 className="mb-4 text-3xl font-bold">{meta.title || 'NASA Image'}</h1>

        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
          {meta.photographer ? `Photographer: ${meta.photographer}` : 'NASA Image Library'}
        </p>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={meta.title || 'Event image'}
            className="mb-4 max-h-[70vh] w-full rounded-lg bg-zinc-100 object-contain shadow-sm"
          />
        )}

        {meta.description && (
          <div className="space-y-4 leading-7 text-zinc-700 dark:text-zinc-300">
            {meta.description
              .split(/\.\s+/)
              .filter(Boolean)
              .map((paragraph, index) => {
                const text = paragraph.trim();
                const formatted = text.endsWith('.') ? text : `${text}.`;

                return (
                  <p
                    key={`${formatted}-${index}`}
                    className={
                      index === 0
                        ? 'first-letter:float-left first-letter:mr-3 first-letter:text-3xl first-letter:font-bold first-letter:leading-none'
                        : ''
                    }
                  >
                    {formatted}
                  </p>
                );
              })}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <Button variant="default" onClick={handleOpenImage} disabled={!imageUrl}>
            Open Image
          </Button>
        </div>
      </div>
    </div>
  );
};