import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { MenuItemForm } from "@/features/menu/menu-item-form";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Add Menu Item" };

export default async function NewMenuItemPage() {
  await requireRole("vendor");
  return (
    <>
      <PageHeader title="Add Menu Item" description="New items are reviewed by an admin before customers can see them." />
      <MenuItemForm />
    </>
  );
}