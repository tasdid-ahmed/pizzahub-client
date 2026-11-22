"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Eye, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { DataTable, Td, Th } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagedQuery } from "@/hooks/use-paged-query";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Order } from "@/types/orders";
import { OrderDetailsDialog } from "./order-details-dialog";

export function VendorOrders() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Order | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, meta, loading, error, setData } = usePagedQuery<Order[]>("/vendor/orders", {
    status: status === "all" ? undefined : status,
    page,
    limit: 10,
  });

  async function decide(order: Order, next: "accepted" | "rejected") {
    setBusyId(order.id);
    try {
      const response = await apiFetch<{ data: Order }>(`/vendor/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      setData((list) => list.map((entry) => (entry.id === order.id ? { ...entry, ...response.data } : entry)));
      toast.success(`Order ${next}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this order");
    } finally {
      setBusyId(null);
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
        <EmptyState title="Could not load orders" description={error} />
      ) : !data ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : data.length === 0 ? (
        <EmptyState title="No orders yet" description="Orders for your menu items will appear here." />
      ) : (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <DataTable className="min-w-[64rem]">
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Item</Th>
                <Th>Delivery date</Th>
                <Th>Address</Th>
                <Th>Message</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => {
                const busy = busyId === order.id;
                return (
                  <tr key={order.id}>
                    <Td>
                      <p className="font-medium">{order.customer?.name ?? "-"}</p>
                      <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          {order.item.image && <Image src={order.item.image} alt="" fill sizes="40px" className="object-cover" />}
                        </div>
                        <span className="line-clamp-1 font-medium">{order.item.name}</span>
                      </div>
                    </Td>
                    <Td>{formatDate(order.deliveryDate)}</Td>
                    <Td className="max-w-44"><span className="line-clamp-2">{order.deliveryAddress}</span></Td>
                    <Td className="max-w-40"><span className="line-clamp-2 text-muted-foreground">{order.message || "-"}</span></Td>
                    <Td><StatusBadge status={order.status} /></Td>
                    <Td>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setViewing(order)}>
                          <Eye /> View
                        </Button>
                        {order.status === "pending" && (
                          <>
                            <Button size="sm" disabled={busy} onClick={() => decide(order, "accepted")}>
                              {busy ? <Loader2 className="animate-spin" /> : <Check />} Accept
                            </Button>
                            <Button size="sm" variant="destructive" disabled={busy} onClick={() => decide(order, "rejected")}>
                              <X /> Reject
                            </Button>
                          </>
                        )}
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

      <OrderDetailsDialog order={viewing} party="customer" onClose={() => setViewing(null)} />
    </div>
  );
}