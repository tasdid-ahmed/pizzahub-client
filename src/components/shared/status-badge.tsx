import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  pending: "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200",
  approved: "border-green-500 bg-green-100 text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-200",
  accepted: "border-green-500 bg-green-100 text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-200",
  paid: "border-green-500 bg-green-100 text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-200",
  active: "border-green-500 bg-green-100 text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-200",
  rejected: "border-red-400 bg-red-100 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  failed: "border-red-400 bg-red-100 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  cancelled: "border-stone-400 bg-stone-200 text-stone-800 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200",
  inactive: "border-stone-400 bg-stone-200 text-stone-800 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        STYLES[status] ?? "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {status}
    </span>
  );
}