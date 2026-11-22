"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Survives re-mounts within one page load, so we retry automatically at most twice and never loop.
let autoRetries = 0;

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  useEffect(() => {
    if (autoRetries >= 2) return;
    autoRetries += 1;
    const timer = setTimeout(retry, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="gingham flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="max-w-md rounded-xl border-2 border-[color:var(--hard)] bg-card p-8 shadow-[4px_4px_0_0_var(--hard)]">
        <h1 className="text-3xl font-black">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          We couldn&apos;t load this page. It usually works on a second try.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={retry} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
        </div>
        {error.digest && <p className="mt-4 text-xs text-muted-foreground">Reference: {error.digest}</p>}
      </div>
    </div>
  );
}