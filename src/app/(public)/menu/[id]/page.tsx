import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ItemDetails } from "@/features/menu/item-details";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Item Details" };

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Logged-out visitors are sent to sign-in and returned here afterwards.
  const user = await requireUser(`/menu/${id}`);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/menu" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> Back to menu
      </Link>
      <ItemDetails id={id} role={user.role} />
    </div>
  );
}