"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { subscriptionApi, type SubscriptionStatus } from "./api";

const FREE_FEATURES = ["Up to 3 active menu items", "Basic vendor dashboard", "Order management"];
const PREMIUM_FEATURES = ["Unlimited active menu items", "Premium vendor badge", "Featured placement on the homepage", "All Free features"];

function Features({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 text-sm">
      {items.map((feature) => (
        <li key={feature} className="flex items-start gap-2">
          <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--basil)]" aria-hidden />
          {feature}
        </li>
      ))}
    </ul>
  );
}

export function SubscriptionPanel() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let current = true;
    subscriptionApi
      .get()
      .then((response) => {
        if (current) setStatus(response.data);
      })
      .catch((err) => {
        if (current) setError(err instanceof Error ? err.message : "Could not load your subscription");
      });
    return () => {
      current = false;
    };
  }, []);

  async function upgrade() {
    setRedirecting(true);
    try {
      const response = await subscriptionApi.checkout();
      window.location.assign(response.data.url); // hands off to Stripe Checkout
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start the payment");
      setRedirecting(false);
    }
  }

  async function cancel() {
    setCancelling(true);
    try {
      const response = await subscriptionApi.cancel();
      setStatus(response.data);
      toast.success("Your subscription will end at the close of this billing period");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel the subscription");
    } finally {
      setCancelling(false);
      setConfirmOpen(false);
    }
  }

  if (error) return <p className="rounded-xl border-2 border-border bg-card p-8 text-center">{error}</p>;
  if (!status) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  const premium = status.plan === "premium";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <section className={cn("rounded-xl border-2 p-6", !premium ? "border-[color:var(--hard)] bg-accent" : "border-border bg-card")}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Free</h2>
            {!premium && <span className="rounded-full border border-[color:var(--hard)] bg-background px-2.5 py-0.5 text-xs font-bold">Current plan</span>}
          </div>
          <p className="mt-2 text-3xl font-black">$0</p>
          <Features items={FREE_FEATURES} />
        </section>

        <section className={cn("rounded-xl border-2 p-6", premium ? "border-[color:var(--hard)] bg-accent" : "border-[color:var(--hard)] bg-card shadow-[4px_4px_0_0_var(--hard)]")}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-black">
              <Crown className="size-5 text-primary" aria-hidden /> Premium
            </h2>
            {premium && <span className="rounded-full border border-[color:var(--hard)] bg-background px-2.5 py-0.5 text-xs font-bold">Current plan</span>}
          </div>
          <p className="mt-2 text-3xl font-black">
            ${status.priceUsd.toFixed(2)} <span className="text-base font-medium text-muted-foreground">/ month</span>
          </p>
          <Features items={PREMIUM_FEATURES} />

          <div className="mt-6 space-y-3">
            {!premium ? (
              <Button size="lg" className="w-full" onClick={upgrade} disabled={redirecting}>
                {redirecting && <Loader2 className="animate-spin" />}
                Upgrade to Premium
              </Button>
            ) : (
              <>
                <p className="text-sm">
                  {status.cancelAtPeriodEnd
                    ? `Your subscription is set to end on ${status.expiresAt ? formatDate(status.expiresAt) : "the end of this period"}. You keep Premium until then.`
                    : `Premium is active${status.expiresAt ? ` until ${formatDate(status.expiresAt)}, then renews automatically` : ""}.`}
                </p>
                {status.canCancel && !status.cancelAtPeriodEnd && (
                  <Button variant="outline" onClick={() => setConfirmOpen(true)}>
                    Cancel subscription
                  </Button>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel your Premium subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              You keep Premium until the end of the current billing period. After that, only your 3 oldest approved items stay visible;
              the others are hidden, not deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Premium</AlertDialogCancel>
            <AlertDialogAction onClick={cancel} disabled={cancelling}>
              {cancelling && <Loader2 className="animate-spin" />}
              Cancel subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}