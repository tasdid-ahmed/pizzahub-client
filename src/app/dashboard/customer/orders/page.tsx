import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerOrders } from "@/features/orders/customer-orders";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "My Orders" };

export default async function CustomerOrdersPage() {
  await requireRole("customer");
  return (
    <>
      <PageHeader title="My Orders" description="Track your orders and cancel the ones that are still pending." />
      <CustomerOrders />
    </>
  );
}