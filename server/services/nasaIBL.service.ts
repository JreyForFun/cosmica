import  { AppError } from "../lib/errors";

export async function fetchNasaIBL(query: string, page = 1, pageSize = 10) {
  const params = new URLSearchParams({
    q: query,
    media_type: "image",
    page: String(page),
    page_size: String(pageSize),
  });

  const response = await fetch(
    `https://images-api.nasa.gov/search?${params.toString()}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NASA API error: ${errorText}`);
  }

  const data = await response.json();
  const items = data?.collection?.items ?? [];

  return {
    items,
    hasMore: items.length === pageSize,
    total: data?.collection?.metadata?.total_hits ?? 0,
  };
}