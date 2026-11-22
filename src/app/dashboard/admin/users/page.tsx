import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { AdminUsers } from "@/features/admin/admin-users";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Manage Users" };

export default async function ManageUsersPage() {
  await requireRole("admin");
  return (
    <>
      <PageHeader title="Manage Users" description="Search, filter and block or unblock vendors and customers." />
      <AdminUsers />
    </>
  );
}