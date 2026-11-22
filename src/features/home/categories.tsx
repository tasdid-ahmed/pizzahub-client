import Link from "next/link";
import { Beef, ChefHat, CupSoda, Leaf, Pizza, Sandwich } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { MENU_CATEGORIES } from "@/lib/constants";

const TILES = {
  classic: { icon: Pizza, tint: "bg-[#fde5d0] dark:bg-[#3a2418]" },
  vegetarian: { icon: Leaf, tint: "bg-[#e3efd5] dark:bg-[#243020]" },
  "meat-lovers": { icon: Beef, tint: "bg-[#f9d6cf] dark:bg-[#3b211c]" },
  specialty: { icon: ChefHat, tint: "bg-[#fbe9b8] dark:bg-[#38301a]" },
  sides: { icon: Sandwich, tint: "bg-[#fce0c0] dark:bg-[#3a2a1a]" },
  "beverages-desserts": { icon: CupSoda, tint: "bg-[#f5dcec] dark:bg-[#35222e]" },
} as const;

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading eyebrow="Browse by craving" title="Pizza Categories" description="Pick a category and jump straight to what you feel like eating." />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {MENU_CATEGORIES.map(({ value, label }) => {
            const { icon: Icon, tint } = TILES[value];
            return (
              <Link
                key={value}
                href={`/menu?category=${value}`}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 border-[color:var(--hard)] p-6 text-center font-bold shadow-[3px_3px_0_0_var(--hard)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--hard)] ${tint}`}
              >
                <Icon className="size-8 text-primary" aria-hidden />
                {label}
              </Link>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}