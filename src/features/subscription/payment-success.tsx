"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscriptionApi } from "./api";

type State = "checking" | "active" | "delayed";

export function PaymentSuccess() {
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      try {
        const response = await subscriptionApi.get();
        if (cancelled) return;
        if (response.data.plan === "premium") {
          setState("active");
          return;
        }
      } catch {
        // keep polling; a transient error shouldn't show a failure
      }
      attempts += 1;
      if (attempts >= 12) {
        if (!cancelled) setState("delayed");
        return;
      }
      timer = setTimeout(poll, 2000);
    }

    void poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="mx-auto max-w-lg rounded-xl border-2 border-[color:var(--hard)] bg-card p-8 text-center shadow-[4px_4px_0_0_var(--hard)]">
      {state === "checking" && (
        <>
          <Loader2 className="mx-auto size-10 animate-spin text-primary" />
          <h1 className="mt-4 text-3xl font-black">Confirming your payment</h1>
          <p className="mt-2 text-muted-foreground">This usually takes a few seconds. Please keep this page open.</p>
        </>
      )}
      {state === "active" && (
        <>
          <CheckCircle2 className="mx-auto size-12 text-[color:var(--basil)]" />
          <h1 className="mt-4 text-3xl font-black">You&apos;re Premium!</h1>
          <p className="mt-2 text-muted-foreground">
            Payment confirmed. You can now publish unlimited menu items, and your restaurant gets the Premium badge and featured placement.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/dashboard/vendor/menu-items/new">Add a menu item</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/vendor/subscription">View subscription</Link>
            </Button>
          </div>
        </>
      )}
      {state === "delayed" && (
        <>
          <Clock className="mx-auto size-12 text-primary" />
          <h1 className="mt-4 text-3xl font-black">Payment received</h1>
          <p className="mt-2 text-muted-foreground">
            Stripe is still confirming your payment. Premium activates automatically as soon as it does. Check your subscription page in a minute.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/vendor/subscription">Go to subscription</Link>
          </Button>
        </>
      )}
    </div>
  );
}