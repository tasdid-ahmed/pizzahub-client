"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MENU_CATEGORIES } from "@/lib/constants";

export function MenuFilters({ locations }: { locations: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") ?? "");

  const update = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      next.delete("page"); // any filter change returns to page 1
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  // Debounced search so we don't query on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((params.get("q") ?? "") !== search.trim()) update({ q: search.trim() || null });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasFilters = ["q", "category", "location", "sort", "minPrice", "maxPrice"].some((key) => params.get(key));

  function clearAll() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.replace(pathname, { scroll: false });
  }

  const applyPrice = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") update({ minPrice: minPrice || null, maxPrice: maxPrice || null });
  };

  return (
    <div className="mb-8 space-y-4 rounded-xl border-2 border-[color:var(--hard)] bg-card p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search pizzas, sides and drinks by name or description"
          aria-label="Search menu"
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Select value={params.get("category") ?? "all"} onValueChange={(value) => update({ category: value === "all" ? null : value })}>
          <SelectTrigger className="w-full" aria-label="Category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {MENU_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={params.get("location") ?? "all"} onValueChange={(value) => update({ location: value === "all" ? null : value })}>
          <SelectTrigger className="w-full" aria-label="Location">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={params.get("sort") ?? "newest"} onValueChange={(value) => update({ sort: value === "newest" ? null : value })}>
          <SelectTrigger className="w-full" aria-label="Sort by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="price_asc">Price: low to high</SelectItem>
            <SelectItem value="price_desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>

        <Input
          inputMode="decimal"
          value={minPrice}
          onChange={(event) => setMinPrice(event.target.value)}
          onBlur={() => update({ minPrice: minPrice || null })}
          onKeyDown={applyPrice}
          placeholder="Min price"
          aria-label="Minimum price"
        />
        <Input
          inputMode="decimal"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          onBlur={() => update({ maxPrice: maxPrice || null })}
          onKeyDown={applyPrice}
          placeholder="Max price"
          aria-label="Maximum price"
        />
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <X /> Clear filters
        </Button>
      )}
    </div>
  );
}