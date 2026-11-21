import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="gingham px-4 py-24 text-center">
      <h1 className="mx-auto max-w-2xl text-5xl font-black">Hot &amp; Fresh Pizza Delivered to Your Door</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">The full home page arrives in Phase 3.</p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/sign-up">Get started</Link>
      </Button>
    </section>
  );
}