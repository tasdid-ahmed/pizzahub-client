import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default async function PaymentCancelPage() {
  await requireRole("vendor");
  return (
    <div className="px-4 py-16">
      <div className="mx-auto max-w-lg rounded-xl border-2 border-[color:var(--hard)] bg-card p-8 text-center shadow-[4px_4px_0_0_var(--hard)]">
        <XCircle className="mx-auto size-12 text-destructive" />
        <h1 className="mt-4 text-3xl font-black">Payment cancelled</h1>
        <p className="mt-2 text-muted-foreground">No charge was made and your plan hasn&apos;t changed. You can upgrade whenever you&apos;re ready.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard/vendor/subscription">Try again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/vendor">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}