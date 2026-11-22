import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="gingham flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="max-w-md rounded-xl border-2 border-[color:var(--hard)] bg-card p-8 shadow-[4px_4px_0_0_var(--hard)]">
        <p className="text-6xl font-black text-primary">404</p>
        <h1 className="mt-2 text-2xl font-black">This page isn&apos;t on the menu</h1>
        <p className="mt-2 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/menu">Browse menu</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}