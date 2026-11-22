import { ClipboardCheck, Search, Truck } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const STEPS = [
  { icon: Search, title: "Browse the menu", text: "Search and filter pizzas, sides and drinks from shops near you." },
  { icon: ClipboardCheck, title: "Place your order", text: "Choose a delivery date, add your address and any special instructions." },
  { icon: Truck, title: "Enjoy it hot", text: "The restaurant accepts your order and gets cooking. Track it in your dashboard." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading eyebrow="Simple as 1-2-3" title="How PizzaHub Works" />
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="relative rounded-xl border-2 border-[color:var(--hard)] bg-card p-6 pt-10">
              <span className="absolute -top-4 left-6 flex size-9 items-center justify-center rounded-full border-2 border-[color:var(--hard)] bg-[color:var(--orange)] text-lg font-black text-[#2b1b14]">
                {index + 1}
              </span>
              <Icon className="mb-3 size-7 text-primary" aria-hidden />
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}