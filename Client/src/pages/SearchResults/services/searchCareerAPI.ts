import type { CareerResponse } from "../types/careerTypes";

const BASE_API = import.meta.env.VITE_SEARCH_API;

export async function fetchCareersBySearchTerm(
  searchTerm: string
): Promise<CareerResponse[]> {
  const dbTypes: ("sfia" | "tpqi")[] = ["sfia", "tpqi"];
  const promises = dbTypes.map(async (dbType) => {
    try {
      const res = await fetch(`${BASE_API}/${dbType}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ searchTerm }),
      });

      if (!res.ok) throw new Error(`Failed to fetch from ${dbType}`);

      const data = await res.json();
      const careers = Array.isArray(data.results) ? data.results : [];

      return { source: dbType, careers };
    } catch (err) {
      console.error(`[${dbType}] Error:`, err);
      return { source: dbType, careers: [] };
    }
  });

  return Promise.all(promises);
}
