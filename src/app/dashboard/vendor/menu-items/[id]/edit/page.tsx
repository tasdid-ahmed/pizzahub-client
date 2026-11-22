import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EditMenuItemLoader } from "@/features/menu/edit-menu-item-loader";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Edit Menu Item" };

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("vendor");
  const { id } = await params;
  return (
    <>
      <PageHeader title="Edit Menu Item" />
      <EditMenuItemLoader id={id} />
    </>
  );
}