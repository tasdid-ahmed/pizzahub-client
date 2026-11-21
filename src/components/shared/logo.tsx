import { Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex size-9 items-center justify-center rounded-full border-2 border-[color:var(--hard)] bg-primary text-primary-foreground shadow-[2px_2px_0_0_var(--hard)]">
        <Pizza className="size-5" aria-hidden />
      </span>
      <span className="text-2xl font-black tracking-tight [font-family:var(--font-display),Georgia,serif]">
        PizzaHub
      </span>
    </span>
  );
}