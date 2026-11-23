
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type DistributionDatum = {
  name: string;
  value: number;
  color?: string;
};

const COLORS = [
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
  "#8B5CF6",
  "#64748B",
];

export function DistributionChart({
  title,
  description,
  data,
  type = "pie",
}: {
  title: string;
  description?: string;
  data: DistributionDatum[];
  type?: "pie" | "bar";
}) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color ?? COLORS[index % COLORS.length],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-xl border-2 border-[color:var(--hard)] bg-card p-5">
      <h2 className="text-base font-semibold">{title}</h2>

      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}

      {total === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          No data available yet.
        </div>
      ) : (
        <div className="mt-4 h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="none"
                >
                  {chartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    color: "var(--card-foreground)",
                  }}
                />
              </PieChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
              >
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    color: "var(--card-foreground)",
                  }}
                />
                <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                  {chartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.name}</span>
            <span className="ml-auto text-sm font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
