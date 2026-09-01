import { useContext, useState } from "react";
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
} from "@/components/ui/card";

type VibteoItem = {
  id: string;
  title: string;
  description?: string;
  url?: string;
};

const vibteoItems: VibteoItem[] = [
  {
    id: "vibteo-1",
    title: "Deep Space Drift",
    description: "A layered space ambience built from distant galaxies and cinematic motion.",
    url: "https://images-assets.nasa.gov/image/iss045e097331/iss045e097331~orig.jpg",
  },
  {
    id: "vibteo-2",
    title: "Moonlit Transit",
    description: "Calm lunar motion and atmospheric motion for a reflective night mood.",
    url: "https://images-assets.nasa.gov/image/iss056e131247/iss056e131247~orig.jpg",
  },
  {
    id: "vibteo-3",
    title: "Orbital Silence",
    description: "A silent and spacious visual loop inspired by orbital stillness.",
    url: "https://images-assets.nasa.gov/image/iss064e013252/iss064e013252~orig.jpg",
  },
];

export const VibteoPage = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [savingFavorite, setSavingFavorite] = useState<Record<string, boolean>>({});

  const isFavorite = (favoriteKey: string) => {
    const legacyFavorites = Array.isArray((auth?.user?.favorites as any)) ? (auth?.user?.favorites as any) : [];
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
            <Button variant="default" onClick={() => navigate("/SOTD")}>
              GO TO CURRENT STAR OF THE DAY
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vibteoItems.map((item) => (
            <Card
              key={item.id}
              className="mx-auto flex w-full max-w-[260px] flex-col overflow-hidden rounded-t-xl border-0 bg-white pt-0 shadow-sm dark:bg-zinc-950"
            >
              <img
                src={item.url}
                alt={item.title}
                className="h-[190px] w-full object-cover brightness-100 dark:brightness-90"
              />

              <CardHeader className="flex min-h-[80px] flex-col gap-2 p-3">
                <CardAction>
                  <Badge variant="secondary" className="text-[10px]">
                    vibteo
                  </Badge>
                </CardAction>
                <CardTitle className="line-clamp-2 text-sm leading-5 text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardFooter className="mt-auto p-3 pt-0">
                <Button
                  type="button"
                  className="h-9 w-full text-xs"
                  onClick={() => handleToggleFavorite(item.id)}
                  disabled={savingFavorite[item.id] || !auth?.user}
                >
                  {savingFavorite[item.id]
                    ? "Saving..."
                    : isFavorite(item.id)
                      ? "Remove favorite"
                      : "Add to favorites"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};