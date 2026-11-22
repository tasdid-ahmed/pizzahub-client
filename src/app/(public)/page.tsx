import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Categories } from "@/features/home/categories";
import { Hero } from "@/features/home/hero";
import { HowItWorks } from "@/features/home/how-it-works";
import { WhyChoose } from "@/features/home/why-choose";
import { MenuCard } from "@/features/menu/menu-card";
import { getFeaturedItems } from "@/lib/public-api";

export default async function HomePage() {
  const featured = await getFeaturedItems(6);

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Fresh picks" title="Featured Menu Items" description="Hand-picked favourites from our restaurants, Premium partners first." />
          {featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState title="Our menu is warming up" description="No items are available right now. Please check back soon." />
          )}
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/menu">View full menu</Link>
            </Button>
          </div>
        </Reveal>
      </section>
      <Categories />
      <WhyChoose />
      <HowItWorks />
    </>
  );
}