import { useQuery, useQueries } from "@tanstack/react-query";
import type { RawCardData, Card } from "../interfaces/cards";

const BASE_API_URL = import.meta.env.PROD
  ? "https://pvz-2-api.vercel.app/api"
  : "/api";

// -----------------------------------------------------------
// Função auxiliar para normalizar os dados crus da API
// -----------------------------------------------------------

const normalizeCard = (
  type: "plants" | "zombies",
  raw: RawCardData
): Card => {
  if (type === "plants") {
    const finalCost =
      raw["Sun cost"] !== undefined
        ? raw["Sun cost"]
        : raw.cost !== undefined
        ? raw.cost
        : 0;

    const finalRecharge = raw.Recharge || raw.recharge || "N/A";

    return {
      type: "Plant",
      name: raw.name,
      description: raw.description,
      image: raw.image,
      cost: finalCost,
      recharge: finalRecharge,
      "sun-production": raw["sun-production"] || "PLANTA",
      area: raw.area || "N/A",
      usage: raw.usage || "N/A",
      special: raw.special || "N/A",
      range: raw.range || "N/A",
      family: raw.family || "N/A",
    };
  }

  const finalToughness =
    raw.Toughness?.toString() ||
    raw.toughness?.toString() ||
    "N/A";
  const finalSpeed = raw.Speed || raw.speed || "N/A";

  return {
    type: "Zombie",
    name: raw.name,
    description: raw.description,
    image: raw.image,
    toughness: finalToughness,
    speed: finalSpeed,
    stamina: raw.stamina || "N/A",
    weakness: raw.weakness || "N/A",
  };
};

// -----------------------------------------------------------
// Hook principal: useCards (React Query)
// -----------------------------------------------------------

export function useCards() {
  const plantsList = useQuery<string[], Error>({
    queryKey: ["plants"],
    queryFn: async () => {
      const r = await fetch(`${BASE_API_URL}/plants`);
      if (!r.ok) throw new Error("Erro ao carregar lista de plantas");
      return (await r.json()) as string[];
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const zombiesList = useQuery<string[], Error>({
    queryKey: ["zombies"],
    queryFn: async () => {
      const r = await fetch(`${BASE_API_URL}/zombies`);
      if (!r.ok) throw new Error("Erro ao carregar lista de zumbis");
      return (await r.json()) as string[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const listsLoading = plantsList.isLoading || zombiesList.isLoading;
  const listsError = plantsList.error || zombiesList.error;

  const detailQueries = useQueries({
  queries: [
    ...(plantsList.data ?? []).map((name: string) => ({
      queryKey: ["plant", name],
      enabled: !listsLoading,
      staleTime: 1000 * 60 * 10,
      queryFn: async (): Promise<Card> => {
        const r = await fetch(`${BASE_API_URL}/plants/${name}`);
        if (!r.ok) {
          throw new Error(`Erro ao carregar planta: ${name}`);
        }
        const raw: RawCardData = await r.json();
        return normalizeCard("plants", raw);
      },
    })),
    ...(zombiesList.data ?? []).map((name: string) => ({
      queryKey: ["zombie", name],
      enabled: !listsLoading,
      staleTime: 1000 * 60 * 10,
      queryFn: async (): Promise<Card> => {
        const r = await fetch(`${BASE_API_URL}/zombies/${name}`);
        if (!r.ok) {
          throw new Error(`Erro ao carregar zumbi: ${name}`);
        }
        const raw: RawCardData = await r.json();
        return normalizeCard("zombies", raw);
      },
    })),
  ],
});

  const cards = detailQueries
  .map((q) => q.data as Card | undefined)
  .filter((card): card is Card => Boolean(card));

  const loading = listsLoading || detailQueries.some((q) => q.isLoading);

  return {
    cards,
    loading,
    error: listsError,
  };
}
