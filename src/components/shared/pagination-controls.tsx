"use client";

import { Button } from "@/components/ui/button";
import type { PageMeta } from "@/types/menu-items";

export function PaginationControls({ meta, onChange }: { meta: PageMeta | null; onChange: (page: number) => void }) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-4">
      <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => onChange(meta.page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {meta.page} of {meta.totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => onChange(meta.page + 1)}>
        Next
      </Button>
    </nav>
  );
}