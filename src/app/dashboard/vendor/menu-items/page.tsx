import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { VendorMenuList } from "@/features/menu/vendor-menu-list";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "My Menu Items" };

export default async function VendorMenuItemsPage() {
  await requireRole("vendor");
  return (
    <>
      <PageHeader
        title="My Menu Items"
        description="Manage what customers see on your menu."
        action={
          <Button asChild>
            <Link href="/dashboard/vendor/menu-items/new">
              <PlusCircle /> Add menu item
            </Link>
          </Button>
        }
      />
      <VendorMenuList />
    </>
  );
}