import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { SignOutButton } from "@/components/shared/sign-out-button";

export const metadata: Metadata = { title: "Account blocked" };

export default function BlockedPage() {
  return (
    <div className="gingham flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="max-w-md rounded-xl border-2 border-[color:var(--hard)] bg-card p-8 shadow-[4px_4px_0_0_var(--hard)]">
        <h1 className="text-3xl font-black">Account blocked</h1>
        <p className="mt-2 text-muted-foreground">
          Your account has been blocked by an administrator, so you can&apos;t use PizzaHub right now.
        </p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}