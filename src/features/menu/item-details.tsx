"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Crown, MapPin, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { categoryLabel, formatPrice, type Role } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PublicMenuItem } from "@/types/menu-items";

function OrderPanel({ role }: { item: PublicMenuItem; role: Role }) {
  if (role !== "customer") {
    return (
      <p className="rounded-lg bg-accent p-4 text-sm">
        {role === "vendor" ? "Vendor accounts can't place orders." : "Admin accounts can't place orders."}
      </p>
    );
  }
  return (
    <Button size="lg" className="w-full" onClick={() => toast.info("Ordering opens in the next update")}>
      Order now
    </Button>
  );
}

export function ItemDetails({ id, role }: { id: string; role: Role }) {
  const [item, setItem] = useState<PublicMenuItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let current = true;
    apiFetch<{ data: PublicMenuItem }>(`/menu-items/${id}`)
      .then((response) => {
        if (current) setItem(response.data);
      })
      .catch((err) => {
        if (current) setError(err instanceof Error ? err.message : "Could not load this item");
      });
    return () => {
      current = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="rounded-xl border-2 border-border bg-card p-10 text-center">
        <p className="text-lg font-semibold">{error}</p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/menu">Back to menu</Link>
        </Button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-[4/3] rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-[color:var(--hard)] bg-muted">
          {item.images[active] && (
            <Image src={item.images[active]} alt={item.itemName} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          )}
        </div>
        {item.images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {item.images.map((url, index) => (
              <button
                key={url}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-lg border-2 bg-muted",
                  index === active ? "border-primary" : "border-border opacity-80 hover:opacity-100",
                )}
              >
                <Image src={url} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5">
        <span className="inline-block rounded-full border border-[color:var(--hard)] bg-accent px-3 py-1 text-xs font-semibold">
          {categoryLabel(item.category)}
        </span>
        <h1 className="text-4xl font-black">{item.itemName}</h1>
        <p className="text-3xl font-black text-primary">{formatPrice(item.price)}</p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" aria-hidden /> {item.location}
        </p>
        <div className="flex items-center gap-3 rounded-lg border-2 border-border bg-card p-3">
          <Store className="size-5 text-primary" aria-hidden />
          <div>
            <p className="text-xs text-muted-foreground">Sold by</p>
            <p className="font-semibold">{item.vendor.name}</p>
          </div>
          {item.vendor.isPremium && (
            <span className="ml-auto flex items-center gap-1 rounded border-2 border-[color:var(--hard)] bg-[color:var(--orange)] px-2 py-0.5 text-xs font-black uppercase text-[#2b1b14]">
              <Crown className="size-3" aria-hidden /> Premium
            </span>
          )}
        </div>
        <p className="whitespace-pre-line text-muted-foreground">{item.description}</p>
        <OrderPanel item={item} role={role} />
      </div>
    </div>
  );
}