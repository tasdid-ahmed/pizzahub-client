import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { VendorOrders } from "@/features/orders/vendor-orders";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Customer Orders" };

export default async function VendorOrdersPage() {
  await requireRole("vendor");
  return (
    <>
      <PageHeader title="Customer Orders" description="Accept or reject incoming orders. Each pending order can be decided once." />
      <VendorOrders />
    </>
  );
}