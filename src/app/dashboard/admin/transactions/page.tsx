import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AdminTransactions } from "@/features/admin/admin-transactions";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Transactions" };

export default async function TransactionsPage() {
  await requireRole("admin");
  return (
    <>
      <PageHeader title="Transactions" description="Subscription payments from vendors. Records are read-only." />
      <AdminTransactions />
    </>
  );
}