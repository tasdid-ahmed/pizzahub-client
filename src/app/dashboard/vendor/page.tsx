import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { VendorOverview } from "@/features/dashboard/overview-cards";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Vendor Overview" };

export default async function VendorOverviewPage() {
  const user = await requireRole("vendor");
  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(" ")[0]}`} description="A quick look at your restaurant." />
      <VendorOverview />
    </>
  );
}