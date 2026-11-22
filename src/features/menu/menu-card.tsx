import Image from "next/image";
import Link from "next/link";
import { Crown, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryLabel, formatPrice } from "@/lib/constants";
import type { PublicMenuItem } from "@/types/menu-items";

export function MenuCard({ item }: { item: PublicMenuItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-[color:var(--hard)] bg-card transition-shadow hover:shadow-[4px_4px_0_0_var(--hard)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {item.images[0] && (
          <Image
            src={item.images[0]}
            alt={item.itemName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full border border-[color:var(--hard)] bg-background px-2.5 py-0.5 text-xs font-semibold">
          {categoryLabel(item.category)}
        </span>
        {item.vendor.isPremium && (
          <span className="absolute right-3 top-3 flex -rotate-3 items-center gap-1 rounded border-2 border-[color:var(--hard)] bg-[color:var(--orange)] px-2 py-0.5 text-xs font-black uppercase tracking-wide text-[#2b1b14]">
            <Crown className="size-3" aria-hidden /> Premium
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-bold">{item.itemName}</h3>
          <span className="text-lg font-black text-primary">{formatPrice(item.price)}</span>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{item.description}</p>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-1">{item.location}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Store className="size-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-1">{item.vendor.name}</span>
          </p>
        </div>
        <Button asChild className="mt-auto w-full">
          <Link href={`/menu/${item.id}`}>View Details</Link>
        </Button>
      </div>
    </article>
  );
}