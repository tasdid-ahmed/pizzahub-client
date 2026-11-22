import { Clock, ShieldCheck, Store, Wallet } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const REASONS = [
  { icon: Clock, title: "Fast, fresh delivery", text: "Orders go straight to the kitchen, so your pizza leaves the oven and heads to your door." },
  { icon: Store, title: "Local shops, real menus", text: "Order from independent pizzerias in your area instead of faceless chains." },
  { icon: ShieldCheck, title: "Every item reviewed", text: "Each menu item is checked by our team before it appears, so what you see is what you get." },
  { icon: Wallet, title: "Honest prices", text: "Prices are set by the restaurants themselves. No hidden fees on your order." },
];

export function WhyChoose() {
  return (
    <section className="bg-secondary/60 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Why PizzaHub" title="Why Choose PizzaHub?" description="We keep ordering pizza simple, local and trustworthy." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border-2 border-[color:var(--hard)] bg-card p-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-[color:var(--hard)] bg-primary text-primary-foreground">
                  <Icon className="size-6" aria-hidden />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}