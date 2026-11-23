"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Crown, ShoppingBag, Store, UtensilsCrossed, XCircle } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { OrderStatusChart } from "@/components/shared/order-status-chart";

function useOverview<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let current = true;
    apiFetch<{ data: T }>(path)
      .then((response) => {
        if (current) setData(response.data);
      })
      .catch((err) => {
        if (current) setError(err instanceof Error ? err.message : "Could not load your statistics");
      });
    return () => {
      current = false;
    };
  }, [path]);
  return { data, error };
}

function Loading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}


export function CustomerOverview() {
  const { data, error } = useOverview<{
    totalOrders: number;
    pendingOrders: number;
    acceptedOrders: number;
    rejectedOrders: number;
    cancelledOrders: number;
  }>("/customer/overview");

  if (error) return <p className="rounded-xl border-2 border-border bg-card p-8 text-center">{error}</p>;
  if (!data) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={data.totalOrders} icon={ShoppingBag} />
        <StatCard label="Pending" value={data.pendingOrders} icon={Clock} />
        <StatCard label="Accepted" value={data.acceptedOrders} icon={CheckCircle2} />
        <StatCard
          label="Rejected"
          value={data.rejectedOrders}
          icon={XCircle}
          hint={`${data.cancelledOrders} cancelled`}
        />
      </div>

      <div className="max-w-2xl">
        <OrderStatusChart
          counts={{
            pending: data.pendingOrders,
            accepted: data.acceptedOrders,
            rejected: data.rejectedOrders,
            cancelled: data.cancelledOrders,
          }}
        />
      </div>

      <Button asChild>
        <Link href="/menu">Order something tasty</Link>
      </Button>
    </div>
  );
}


export function VendorOverview() {
  const { data, error } = useOverview<{
    totalMenuItems: number;
    activeMenuItems: number;
    pendingOrders: number;
    acceptedOrders: number;
    plan: "free" | "premium";
    subscriptionExpiresAt: string | null;
  }>("/vendor/overview");

  if (error) return <p className="rounded-xl border-2 border-border bg-card p-8 text-center">{error}</p>;
  if (!data) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total menu items" value={data.totalMenuItems} icon={UtensilsCrossed} />
        <StatCard label="Active menu items" value={data.activeMenuItems} icon={Store} hint="Approved and visible" />
        <StatCard label="Pending orders" value={data.pendingOrders} icon={Clock} />
        <StatCard label="Accepted orders" value={data.acceptedOrders} icon={CheckCircle2} />
        <StatCard
          label="Current plan"
          value={data.plan === "premium" ? "Premium" : "Free"}
          icon={Crown}
          hint={data.plan === "premium" && data.subscriptionExpiresAt ? `Renews or ends ${formatDate(data.subscriptionExpiresAt)}` : "Up to 3 active items"}
        />
      </div>
      {data.plan === "free" && (
        <Button asChild>
          <Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link>
        </Button>
      )}
    </div>
  );
}