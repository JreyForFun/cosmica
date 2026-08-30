import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ApodData = {
  copyright?: string;
  title?: string;
  explanation?: string;
  url?: string;
  hdurl?: string;
  date?: string;
  media_type?: string;
};

export const CosmicaDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { date } = useParams();
  const [event, setEvent] = useState<ApodData | null>(
    (location.state as { event?: ApodData } | null)?.event ?? null
  );
  const [loading, setLoading] = useState(!event && Boolean(date));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event || !date) {
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/nasa/apod/range?startDate=${date}&endDate=${date}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load event");
        }

        const items = Array.isArray(data?.apod) ? data.apod : [];
        setEvent(items[0] ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [date, event]);

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

  if (!event) {
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
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
          {event.date || "Featured"}
        </p>

        <h1 className="mb-4 text-3xl font-bold">{event.title || "Astronomy Event"}</h1>

        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
          {event.copyright ? `Owner of the image: ${event.copyright}` : "Astronomy Picture of the Day"}
        </p>

        {event.url && (
          <img
            src={event.url}
            alt={event.title || "Event image"}
            className="mb-4 w-full rounded-lg object-contain shadow-sm max-h-[70vh] bg-zinc-100"
          />
        )}

        {event.explanation && (
          <div className="space-y-4 leading-7 text-zinc-700 dark:text-zinc-300">
            {event.explanation
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
      </div>
    </div>
  );
};