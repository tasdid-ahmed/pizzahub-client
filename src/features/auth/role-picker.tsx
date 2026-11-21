"use client";

import { ShoppingBag, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SignupRole } from "@/lib/constants";

const OPTIONS = [
  { value: "customer", title: "Customer", description: "Browse menus and order pizza", icon: ShoppingBag },
  { value: "vendor", title: "Vendor", description: "Run a restaurant and manage orders", icon: Store },
] as const;

export function RolePicker({
  value,
  onChange,
  disabled,
}: {
  value: SignupRole;
  onChange: (role: SignupRole) => void;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Account role" className="grid grid-cols-2 gap-3">
      {OPTIONS.map(({ value: option, title, description, icon: Icon }) => (
        <label
          key={option}
          className={cn(
            "flex cursor-pointer flex-col gap-1 rounded-lg border-2 p-3 transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
            value === option
              ? "border-[color:var(--hard)] bg-accent shadow-[3px_3px_0_0_var(--hard)]"
              : "border-border bg-card hover:bg-accent/50",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <input
            type="radio"
            name="role"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            disabled={disabled}
            className="sr-only"
          />
          <Icon className="size-5 text-primary" aria-hidden />
          <span className="font-semibold">{title}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </label>
      ))}
    </div>
  );
}