import type { Metadata } from "next";
import { PaymentSuccess } from "@/features/subscription/payment-success";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Payment Successful" };

export default async function PaymentSuccessPage() {
  await requireRole("vendor");
  return (
    <div className="px-4 py-16">
      <PaymentSuccess />
    </div>
  );
}