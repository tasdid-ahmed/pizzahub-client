"use client";

import { useState } from "react";
import { DataTable, Td, Th } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { StatusBadge } from "@/components/shared/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagedQuery } from "@/hooks/use-paged-query";
import type { AdminTransaction } from "@/types/admin";

export function AdminTransactions() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const { data, meta, loading, error } = usePagedQuery<AdminTransaction[]>("/admin/transactions", {
    status: status === "all" ? undefined : status,
    page,
    limit: 10,
  });

  return (
    <div className="space-y-5">
      <div className="max-w-xs">
        <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
          <SelectTrigger className="w-full" aria-label="Filter by payment status">
            <SelectValue placeholder="Payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <EmptyState title="Could not load transactions" description={error} />
      ) : !data ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : data.length === 0 ? (
        <EmptyState title="No transactions yet" description="Subscription payments will appear here." />
      ) : (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <DataTable>
            <thead>
              <tr>
                <Th>Vendor</Th>
                <Th>Plan</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Reference</Th>
              </tr>
            </thead>
            <tbody>
              {data.map((transaction) => (
                <tr key={transaction.id}>
                  <Td>
                    <p className="font-medium">{transaction.vendor.name}</p>
                    <p className="text-xs text-muted-foreground">{transaction.vendor.email}</p>
                  </Td>
                  <Td className="capitalize">{transaction.plan}</Td>
                  <Td>
                    {transaction.amount.toFixed(2)} {transaction.currency.toUpperCase()}
                  </Td>
                  <Td>
                    <StatusBadge status={transaction.status} />
                  </Td>
                  <Td>{new Date(transaction.createdAt).toLocaleString()}</Td>
                  <Td className="font-mono text-xs text-muted-foreground">
                    {transaction.stripeSessionId ? `${transaction.stripeSessionId.slice(0, 14)}...` : "-"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          <PaginationControls meta={meta} onChange={setPage} />
        </div>
      )}
    </div>
  );
}