"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { MenuItem } from "@/types/menu-items";
import { vendorItemsApi } from "./api";
import { MenuItemForm } from "./menu-item-form";

export function EditMenuItemLoader({ id }: { id: string }) {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    vendorItemsApi
      .get(id)
      .then((response) => {
        if (active) setItem(response.data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Could not load this menu item");
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="max-w-3xl rounded-xl border-2 border-border bg-card p-8 text-center">
        <p className="font-medium">{error}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/dashboard/vendor/menu-items">Back to my menu</Link>
        </Button>
      </div>
    );
  }
  if (!item) {
    return (
      <div className="max-w-3xl space-y-4 rounded-xl border-2 border-border bg-card p-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  return <MenuItemForm item={item} />;
}