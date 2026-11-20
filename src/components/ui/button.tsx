import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-[color:var(--hard)] text-sm font-semibold shadow-[3px_3px_0_0_var(--hard)] outline-none transition-[transform,box-shadow,background-color,color] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--hard)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "bg-card text-foreground hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        ghost:
          "border-transparent shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-accent hover:shadow-none active:translate-x-0 active:translate-y-0",
        link: "border-transparent text-primary shadow-none underline-offset-4 hover:translate-x-0 hover:translate-y-0 hover:underline hover:shadow-none active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 px-2 text-xs",
        sm: "h-9 px-3",
        lg: "h-11 px-6 text-base",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };