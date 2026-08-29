import { AppError } from "../lib/errors";

export async function fetchNasaAPOD() {
  const apiKey = process.env.NASA_API_KEY;

  if (!apiKey) {
    throw new AppError(500, "NASA API key is not defined");
  }

  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new AppError(response.status, `NASA API error: ${errorText}`);
  }

  return await response.json();
}