import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { SubscriptionPanel } from "@/features/subscription/subscription-panel";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Subscription" };

export default async function SubscriptionPage() {
  await requireRole("vendor");
  return (
    <>
      <PageHeader title="Subscription" description="Upgrade to Premium for unlimited menu items and featured placement." />
      <SubscriptionPanel />
    </>
  );
}