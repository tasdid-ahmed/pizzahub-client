import type { Metadata } from "next";
import { Suspense } from "react";
import { MenuFilters } from "@/features/menu/menu-filters";
import { MenuGridSkeleton, MenuResults } from "@/features/menu/menu-results";
import { getMenuFilters } from "@/lib/public-api";

export const metadata: Metadata = { title: "Browse Menu" };

const QUERY_KEYS = ["q", "category", "location", "sort", "page", "minPrice", "maxPrice"];

export default async function BrowseMenuPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const key of QUERY_KEYS) {
    const value = params[key];
    if (typeof value === "string" && value.trim()) query.set(key, value.trim());
  }
  const filters = await getMenuFilters();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-black">Browse Menu</h1>
        <p className="mt-2 text-muted-foreground">Search and filter pizzas, sides and drinks from local restaurants.</p>
      </header>
      <MenuFilters locations={filters.locations} />
      <Suspense key={query.toString()} fallback={<MenuGridSkeleton />}>
        <MenuResults query={query} />
      </Suspense>
    </div>
  );
}