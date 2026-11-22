"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Check, Eye, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { DataTable, Td, Th } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagedQuery } from "@/hooks/use-paged-query";
import { MENU_CATEGORIES, categoryLabel, formatPrice } from "@/lib/constants";
import type { AdminItem } from "@/types/admin";
import { adminApi } from "./api";

type NextStatus = "approved" | "rejected" | "inactive";

// Which moderation actions make sense for each current status.
const ACTIONS: Record<string, { status: NextStatus; label: string; icon: typeof Check; destructive?: boolean }[]> = {
  pending: [
    { status: "approved", label: "Approve", icon: Check },
    { status: "rejected", label: "Reject", icon: X, destructive: true },
  ],
  approved: [
    { status: "inactive", label: "Deactivate", icon: X },
    { status: "rejected", label: "Reject", icon: X, destructive: true },
  ],
  inactive: [
    { status: "approved", label: "Approve", icon: Check },
    { status: "rejected", label: "Reject", icon: X, destructive: true },
  ],
  rejected: [{ status: "approved", label: "Approve", icon: Check }],
};

export function AdminMenuItems() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<AdminItem | null>(null);
  const [deleting, setDeleting] = useState<AdminItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, meta, loading, error, setData } = usePagedQuery<AdminItem[]>("/admin/menu-items", {
    q,
    status: status === "all" ? undefined : status,
    category: category === "all" ? undefined : category,
    page,
    limit: 10,
  });

  async function changeStatus(item: AdminItem, next: NextStatus) {
    setBusyId(item.id);
    try {
      const response = await adminApi.setItemStatus(item.id, next);
      setData((list) => list.map((entry) => (entry.id === item.id ? response.data : entry)));
      toast.success(`"${item.itemName}" marked as ${next}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this item");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    const item = deleting;
    setBusyId(item.id);
    try {
      await adminApi.deleteItem(item.id);
      setData((list) => list.filter((entry) => entry.id !== item.id));
      toast.success("Menu item deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete this item");
    } finally {
      setBusyId(null);
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_14rem]">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by item name or location" aria-label="Search menu items" />
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
          <SelectTrigger className="w-full" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(value) => { setCategory(value); setPage(1); }}>
          <SelectTrigger className="w-full" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {MENU_CATEGORIES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <EmptyState title="Could not load menu items" description={error} />
      ) : !data ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : data.length === 0 ? (
        <EmptyState title="No menu items found" description="Try a different search or filter." />
      ) : (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <DataTable className="min-w-[56rem]">
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Vendor</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                const busy = busyId === item.id;
                return (
                  <tr key={item.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                          {item.images[0] && <Image src={item.images[0]} alt="" fill sizes="48px" className="object-cover" />}
                        </div>
                        <span className="line-clamp-1 font-medium">{item.itemName}</span>
                      </div>
                    </Td>
                    <Td>
                      <p className="font-medium">{item.vendor.name}</p>
                      <p className="text-xs text-muted-foreground">{item.vendor.email}</p>
                    </Td>
                    <Td>{categoryLabel(item.category)}</Td>
                    <Td>{formatPrice(item.price)}</Td>
                    <Td>
                      <StatusBadge status={item.status} />
                    </Td>
                    <Td>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setViewing(item)}>
                          <Eye /> View
                        </Button>
                        {(ACTIONS[item.status] ?? []).map((action) => (
                          <Button
                            key={action.status}
                            size="sm"
                            variant={action.destructive ? "destructive" : "default"}
                            disabled={busy}
                            onClick={() => changeStatus(item, action.status)}
                          >
                            {busy ? <Loader2 className="animate-spin" /> : <action.icon />}
                            {action.label}
                          </Button>
                        ))}
                        <Button size="icon-sm" variant="outline" aria-label="Delete item" disabled={busy} onClick={() => setDeleting(item)}>
                          <Trash2 />
                        </Button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
          <PaginationControls meta={meta} onChange={setPage} />
        </div>
      )}

      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.itemName}</DialogTitle>
                <DialogDescription>
                  {categoryLabel(viewing.category)} · {formatPrice(viewing.price)} · {viewing.location} · by {viewing.vendor.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                {viewing.images.map((url) => (
                  <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
                    <Image src={url} alt={viewing.itemName} fill sizes="300px" className="object-cover" />
                  </div>
                ))}
              </div>
              <StatusBadge status={viewing.status} className="w-fit" />
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
              &quot;{deleting?.itemName}&quot; will be permanently removed and any pending or accepted orders for it will be cancelled.
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