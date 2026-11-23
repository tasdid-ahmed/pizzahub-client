
"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type OrderStatusCounts = {
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
};

const STATUS_CONFIG = [
  { key: "pending", label: "Pending", color: "#F59E0B" },
  { key: "accepted", label: "Accepted", color: "#16A34A" },
  { key: "rejected", label: "Rejected", color: "#EF4444" },
  { key: "cancelled", label: "Cancelled", color: "#64748B" },
] as const;

export function OrderStatusChart({
  counts,
  title = "Order status distribution",
}: {
  counts: OrderStatusCounts;
  title?: string;
}) {
  const data = STATUS_CONFIG.map((status) => ({
    name: status.label,
    value: counts[status.key],
    color: status.color,
  })).filter((status) => status.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-xl border-2 border-[color:var(--hard)] bg-card p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Breakdown of orders by their current status
      </p>

      {total === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          No order data available yet.
        </div>
      ) : (
        <div className="mt-4 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [`${value} orders`, name]}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  color: "var(--card-foreground)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATUS_CONFIG.map((status) => (
          <div key={status.key} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            <span className="text-xs text-muted-foreground">
              {status.label}
            </span>
            <span className="ml-auto text-sm font-semibold">
              {counts[status.key]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
