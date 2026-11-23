"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, Receipt, ShieldCheck, Store, UserRound, Users, UtensilsCrossed } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminOverview as Overview } from "@/types/admin";
import { adminApi } from "./api";
import { DistributionChart } from "@/components/shared/distribution-chart";

export function AdminOverview() {
  const [stats, setStats] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let current = true;
    adminApi
      .overview()
      .then((response) => {
        if (current) setStats(response.data);
      })
      .catch((err) => {
        if (current) setError(err instanceof Error ? err.message : "Could not load statistics");
      });
    return () => {
      current = false;
    };
  }, []);

  if (error) return <p className="rounded-xl border-2 border-border bg-card p-8 text-center">{error}</p>;
  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Registered users" value={stats.totalUsers} icon={Users} />
        <StatCard label="Vendors" value={stats.totalVendors} icon={Store} />
        <StatCard label="Customers" value={stats.totalCustomers} icon={UserRound} />
        <StatCard label="Menu items" value={stats.totalMenuItems} icon={UtensilsCrossed} />
        <StatCard label="Pending menu items" value={stats.pendingMenuItems} icon={ClipboardList} hint="Waiting for review" />
        <StatCard label="Transactions" value={stats.totalTransactions} icon={Receipt} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DistributionChart
          title="User composition"
          description="Distribution of registered users by role"
          type="pie"
          data={[
            {
              name: "Vendors",
              value: stats.totalVendors,
              color: "#0EA5E9",
            },
            {
              name: "Customers",
              value: stats.totalCustomers,
              color: "#10B981",
            },
            {
              name: "Admins",
              value: Math.max(
                0,
                stats.totalUsers - stats.totalVendors - stats.totalCustomers,
              ),
              color: "#8B5CF6",
            },
          ]}
        />

        <DistributionChart
          title="Menu item status"
          description="Review the current status of platform menu items"
          type="bar"
          data={[
            {
              name: "Approved",
              value: stats.itemsByStatus.approved ?? 0,
              color: "#10B981",
            },
            {
              name: "Pending",
              value: stats.itemsByStatus.pending ?? 0,
              color: "#F59E0B",
            },
            {
              name: "Rejected",
              value: stats.itemsByStatus.rejected ?? 0,
              color: "#F43F5E",
            },
            {
              name: "Inactive",
              value: stats.itemsByStatus.inactive ?? 0,
              color: "#64748B",
            },
          ]}
        />
      </div>

      {stats.pendingMenuItems > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-[color:var(--hard)] bg-accent p-5">
          <p className="flex items-center gap-2 font-medium">
            <ShieldCheck className="size-5 text-primary" aria-hidden />
            {stats.pendingMenuItems} menu {stats.pendingMenuItems === 1 ? "item needs" : "items need"} your review.
          </p>
          <Button asChild>
            <Link href="/dashboard/admin/menu-items?status=pending">Review now</Link>
          </Button>
        </div>
      )}
    </div>
  );
}