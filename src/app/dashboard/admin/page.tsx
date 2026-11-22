import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AdminOverview } from "@/features/admin/admin-overview";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  await requireRole("admin");
  return (
    <>
      <PageHeader title="Admin Overview" description="A snapshot of the platform." />
      <AdminOverview />
    </>
  );
}