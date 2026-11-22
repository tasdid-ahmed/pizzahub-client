"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Loader2, XCircle } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagedQuery } from "@/hooks/use-paged-query";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Order } from "@/types/orders";
import { OrderDetailsDialog } from "./order-details-dialog";

export function CustomerOrders() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  const { data, meta, loading, error, setData } = usePagedQuery<Order[]>("/customer/orders", {
    status: status === "all" ? undefined : status,
    page,
    limit: 10,
  });

  async function confirmCancel() {
    if (!cancelling) return;
    const target = cancelling;
    setBusy(true);
    try {
      const response = await apiFetch<{ data: Order }>(`/customer/orders/${target.id}/cancel`, { method: "PATCH" });
      setData((list) => list.map((order) => (order.id === target.id ? { ...order, ...response.data } : order)));
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel this order");
    } finally {
      setBusy(false);
      setCancelling(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="max-w-xs">
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
          <SelectTrigger className="w-full" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <EmptyState title="Could not load your orders" description={error} />
      ) : !data ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : data.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you order a pizza, it will show up here."
          action={
            <Button asChild>
              <Link href="/menu">Browse the menu</Link>
            </Button>
          }
        />
      ) : (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <DataTable className="min-w-[56rem]">
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Restaurant</Th>
                <Th>Delivery date</Th>
                <Th>Address</Th>
                <Th>Status</Th>
                <Th>Requested</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        {order.item.image && <Image src={order.item.image} alt="" fill sizes="48px" className="object-cover" />}
                      </div>
                      <span className="line-clamp-1 font-medium">{order.item.name}</span>
                    </div>
                  </Td>
                  <Td>{order.vendor?.name ?? "-"}</Td>
                  <Td>{formatDate(order.deliveryDate)}</Td>
                  <Td className="max-w-48"><span className="line-clamp-2">{order.deliveryAddress}</span></Td>
                  <Td><StatusBadge status={order.status} /></Td>
                  <Td>{formatDate(order.createdAt)}</Td>
                  <Td>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewing(order)}>
                        <Eye /> View
                      </Button>
                      {order.status === "pending" && (
                        <Button size="sm" variant="destructive" onClick={() => setCancelling(order)}>
                          <XCircle /> Cancel
                        </Button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          <PaginationControls meta={meta} onChange={setPage} />
        </div>
      )}

      <OrderDetailsDialog order={viewing} party="vendor" onClose={() => setViewing(null)} />

      <AlertDialog open={cancelling !== null} onOpenChange={(open) => !open && setCancelling(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              Your order for &quot;{cancelling?.item.name}&quot; will be cancelled. Only pending orders can be cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep order</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} disabled={busy}>
              {busy && <Loader2 className="animate-spin" />}
              Cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}