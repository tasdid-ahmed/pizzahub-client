import { Check, X } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/orders";

type StepState = "done" | "current" | "upcoming" | "failed";
type Step = { label: string; detail?: string; state: StepState };

function buildSteps(order: Order): Step[] {
  const steps: Step[] = [{ label: "Order placed", detail: formatDateTime(order.createdAt), state: "done" }];
  switch (order.status) {
    case "pending":
      steps.push(
        { label: "Waiting for the restaurant", state: "current" },
        { label: "Delivery", detail: formatDate(order.deliveryDate), state: "upcoming" },
      );
      break;
    case "accepted":
      steps.push(
        { label: "Accepted by the restaurant", detail: formatDateTime(order.updatedAt), state: "done" },
        { label: "Delivery scheduled", detail: formatDate(order.deliveryDate), state: "current" },
      );
      break;
    case "rejected":
      steps.push({ label: "Rejected by the restaurant", detail: formatDateTime(order.updatedAt), state: "failed" });
      break;
    case "cancelled":
      steps.push({ label: "Cancelled", detail: formatDateTime(order.updatedAt), state: "failed" });
      break;
  }
  return steps;
}

export function OrderTimeline({ order }: { order: Order }) {
  const steps = buildSteps(order);
  return (
    <ol aria-label="Order status timeline" className="space-y-0">
      {steps.map((step, index) => (
        <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
          {index < steps.length - 1 && <span aria-hidden className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />}
          <span
            className={cn(
              "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
              step.state === "done" && "border-[color:var(--basil)] bg-[color:var(--basil)] text-white",
              step.state === "current" && "border-primary bg-background",
              step.state === "upcoming" && "border-border bg-background",
              step.state === "failed" && "border-destructive bg-destructive text-white",
            )}
          >
            {step.state === "done" && <Check className="size-3.5" aria-hidden />}
            {step.state === "failed" && <X className="size-3.5" aria-hidden />}
            {step.state === "current" && <span className="size-2.5 animate-pulse rounded-full bg-primary" />}
          </span>
          <div className="-mt-0.5">
            <p className={cn("text-sm font-semibold", step.state === "upcoming" && "text-muted-foreground")}>{step.label}</p>
            {step.detail && <p className="text-xs text-muted-foreground">{step.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}