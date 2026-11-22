import type { PageMeta, PublicMenuItem } from "@/types/menu-items";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

/** Server-side fetch for public endpoints. Returns null on any failure so pages can show a friendly state. */
async function publicFetch<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}/api${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getFeaturedItems(limit = 6): Promise<PublicMenuItem[]> {
  const result = await publicFetch<{ data: PublicMenuItem[] }>(`/menu-items/featured?limit=${limit}`);
  return result?.data ?? [];
}

export async function getMenuPage(query: URLSearchParams) {
  return publicFetch<{ data: PublicMenuItem[]; meta: PageMeta }>(`/menu-items?${query.toString()}`);
}

export async function getMenuFilters(): Promise<{ locations: string[] }> {
  const result = await publicFetch<{ data: { locations: string[] } }>("/menu-items/filters");
  return result?.data ?? { locations: [] };
}