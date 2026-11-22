import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CustomerOverview } from "@/features/dashboard/overview-cards";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Customer Overview" };

export default async function CustomerOverviewPage() {
  const user = await requireRole("customer");
  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(" ")[0]}`} description="Here's how your orders are going." />
      <CustomerOverview />
    </>
  );
}