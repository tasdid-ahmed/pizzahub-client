import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getMenuPage } from "@/lib/public-api";
import type { PageMeta } from "@/types/menu-items";
import { MenuCard } from "./menu-card";

export function MenuGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading menu">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-[26rem] rounded-xl" />
      ))}
    </div>
  );
}

function Pagination({ meta, query }: { meta: PageMeta; query: URLSearchParams }) {
  if (meta.totalPages <= 1) return null;
  const href = (page: number) => {
    const next = new URLSearchParams(query);
    next.set("page", String(page));
    return `/menu?${next.toString()}`;
  };
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-4">
      {meta.page > 1 ? (
        <Button asChild variant="outline" size="sm">
          <Link href={href(meta.page - 1)}>Previous</Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>Previous</Button>
      )}
      <span className="text-sm text-muted-foreground">
        Page {meta.page} of {meta.totalPages}
      </span>
      {meta.page < meta.totalPages ? (
        <Button asChild variant="outline" size="sm">
          <Link href={href(meta.page + 1)}>Next</Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>Next</Button>
      )}
    </nav>
  );
}

export async function MenuResults({ query }: { query: URLSearchParams }) {
  const result = await getMenuPage(query);

  if (!result) {
    return (
      <EmptyState
        title="We couldn't load the menu"
        description="Something went wrong while fetching items. Try again or clear your filters."
        action={
          <Button asChild variant="outline">
            <Link href="/menu">Reset and retry</Link>
          </Button>
        }
      />
    );
  }

  const { data, meta } = result;
  if (data.length === 0) {
    return (
      <EmptyState
        title="No pizzas match your search"
        description="Try a different keyword, widen the price range or clear your filters."
        action={
          <Button asChild variant="outline">
            <Link href="/menu">Clear filters</Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {meta.total} {meta.total === 1 ? "item" : "items"} found
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
      <Pagination meta={meta} query={query} />
    </>
  );
}