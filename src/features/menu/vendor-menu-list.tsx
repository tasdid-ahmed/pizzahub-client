"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, MapPin, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { FREE_PLAN_ITEM_LIMIT, categoryLabel, formatPrice } from "@/lib/constants";
import type { MenuItem } from "@/types/menu-items";
import { vendorItemsApi } from "./api";

type Plan = "free" | "premium";

export function VendorMenuList() {
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState<MenuItem | null>(null);

  const load = useCallback(async () => {
    try {
      const [list, me] = await Promise.all([
        vendorItemsApi.list(),
        apiFetch<{ data: { plan: Plan } }>("/me"),
      ]);
      setItems(list.data);
      setPlan(me.data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your menu items");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function retry() {
    setError(null);
    setItems(null);
    void load();
  }

  async function toggleAvailability(item: MenuItem) {
    setBusyId(item.id);
    try {
      const response = await vendorItemsApi.setAvailability(item.id, item.status === "inactive");
      setItems((current) => current?.map((entry) => (entry.id === item.id ? response.data : entry)) ?? current);
      toast.success(response.message ?? "Availability updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update availability");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const target = deleting;
    setBusyId(target.id);
    try {
      await vendorItemsApi.remove(target.id);
      setItems((current) => current?.filter((entry) => entry.id !== target.id) ?? current);
      toast.success("Menu item deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete this item");
    } finally {
      setBusyId(null);
      setDeleting(null);
    }
  }

  if (error) {
    return (
      <div className="rounded-xl border-2 border-border bg-card p-8 text-center">
        <p className="font-medium">{error}</p>
        <Button variant="outline" className="mt-4" onClick={retry}>
          Try again
        </Button>
      </div>
    );
  }

  if (!items) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-80 rounded-xl" />
        ))}
      </div>
    );
  }

  const liveCount = items.filter((item) => item.status === "pending" || item.status === "approved").length;

  return (
    <div className="space-y-6">
      {plan === "free" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-[color:var(--hard)] bg-accent p-4">
          <p className="text-sm">
            Free plan: <strong>{liveCount} of {FREE_PLAN_ITEM_LIMIT}</strong> active items used.
          </p>
          <Button asChild size="sm">
            <Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link>
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
          <p className="text-lg font-semibold">You haven&apos;t added any menu items yet</p>
          <p className="mt-1 text-muted-foreground">Add your first pizza and it will go to admin review.</p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/vendor/menu-items/new">
              <PlusCircle /> Add menu item
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const busy = busyId === item.id;
            const canToggle = item.status === "approved" || item.status === "inactive";
            return (
              <article key={item.id} className="flex flex-col overflow-hidden rounded-xl border-2 border-[color:var(--hard)] bg-card">
                <div className="relative aspect-[4/3] bg-muted">
                  {item.images[0] && (
                    <Image src={item.images[0]} alt={item.itemName} fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
                  )}
                  <StatusBadge status={item.status} className="absolute left-3 top-3" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h2 className="line-clamp-1 text-lg font-bold">{item.itemName}</h2>
                    <p className="text-sm text-muted-foreground">{categoryLabel(item.category)}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="size-3.5" /> <span className="line-clamp-1">{item.location}</span>
                    </span>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setViewing(item)}>
                      <Eye /> View
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/vendor/menu-items/${item.id}/edit`}>
                        <Pencil /> Edit
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!canToggle || busy}
                      title={canToggle ? undefined : "Only approved items can be hidden or shown"}
                      onClick={() => toggleAvailability(item)}
                    >
                      {busy ? <Loader2 className="animate-spin" /> : item.status === "inactive" ? <Eye /> : <EyeOff />}
                      {item.status === "inactive" ? "Show" : "Hide"}
                    </Button>
                    <Button size="sm" variant="destructive" disabled={busy} onClick={() => setDeleting(item)}>
                      <Trash2 /> Delete
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.itemName}</DialogTitle>
                <DialogDescription>
                  {categoryLabel(viewing.category)} · {formatPrice(viewing.price)} · {viewing.location}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                {viewing.images.map((url) => (
                  <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
                    <Image src={url} alt={viewing.itemName} fill sizes="300px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={viewing.status} />
                <span className="text-xs text-muted-foreground">
                  Added {new Date(viewing.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="whitespace-pre-line text-sm">{viewing.description}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleting?.itemName}&quot; will be permanently removed. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep item</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}