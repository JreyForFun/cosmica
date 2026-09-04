export type NasaVideoItem = {
  href?: string;
  data?: Array<{
    title?: string;
    description?: string;
    nasa_id?: string;
  }>;
  links?: Array<{ href?: string; rel?: string; render?: string }>;
  videoUrl?: string;
};

function findVideoUrl(value: unknown): string | undefined {
  if (typeof value === "string") {
    return /\.(mp4|webm|mov)(\?|$)/i.test(value) ? value : undefined;
  }

  if (Array.isArray(value)) {
    return value.map(findVideoUrl).find(Boolean);
  }

  if (value && typeof value === "object") {
    for (const child of Object.values(value)) {
      const videoUrl = findVideoUrl(child);
      if (videoUrl) return videoUrl;
    }
  }

  return undefined;
}

export async function fetchNasaVideos(query: string, page = 1, pageSize = 10) {
  const params = new URLSearchParams({
    q: query,
    media_type: "video",
    page: String(page),
    page_size: String(pageSize),
  });

  const response = await fetch(`https://images-api.nasa.gov/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`NASA API error: ${await response.text()}`);
  }

  const data = await response.json();
  const items: NasaVideoItem[] = data?.collection?.items ?? [];

  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      if (!item.href) return item;

      const assetResponse = await fetch(item.href);
      if (!assetResponse.ok) return item;

      const assetData = await assetResponse.json();
      return { ...item, videoUrl: findVideoUrl(assetData) };
    }),
  );

  return {
    items: enrichedItems,
    hasMore: items.length === pageSize,
    total: data?.collection?.metadata?.total_hits ?? 0,
  };
}