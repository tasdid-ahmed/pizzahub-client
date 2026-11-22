import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminMenuItems } from "@/features/admin/admin-menu-items";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Manage Menu Items" };

export default async function ManageMenuItemsPage() {
  await requireRole("admin");
  return (
    <>
      <PageHeader title="Manage Menu Items" description="Review new items, change the status of published ones, or remove inappropriate content." />
      <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
        <AdminMenuItems />
      </Suspense>
    </>
  );
}