"use client";

import Image from "next/image";
import { StatusBadge } from "@/components/shared/status-badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/format";
import type { Order } from "@/types/orders";

export function OrderDetailsDialog({
  order,
  party,
  onClose,
}: {
  order: Order | null;
  party: "vendor" | "customer";
  onClose: () => void;
}) {
  const other = order ? order[party] : undefined;
  return (
    <Dialog open={order !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle>{order.item.name}</DialogTitle>
              <DialogDescription>Order placed {formatDateTime(order.createdAt)}</DialogDescription>
            </DialogHeader>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
              {order.item.image && <Image src={order.item.image} alt={order.item.name} fill sizes="480px" className="object-cover" />}
            </div>
            <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Status</dt>
              <dd><StatusBadge status={order.status} /></dd>
              <dt className="text-muted-foreground">Price</dt>
              <dd>{formatPrice(order.item.price)}</dd>
              <dt className="text-muted-foreground">Delivery date</dt>
              <dd>{formatDate(order.deliveryDate)}</dd>
              <dt className="text-muted-foreground">Address</dt>
              <dd className="whitespace-pre-line">{order.deliveryAddress}</dd>
              <dt className="text-muted-foreground">Instructions</dt>
              <dd className="whitespace-pre-line">{order.message || "None"}</dd>
              {other && (
                <>
                  <dt className="text-muted-foreground capitalize">{party}</dt>
                  <dd>
                    {other.name}
                    <span className="block text-xs text-muted-foreground">{other.email}</span>
                  </dd>
                </>
              )}
            </dl>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}