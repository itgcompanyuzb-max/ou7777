import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell, ScreenHeader } from "@/components/phone-shell";
import { AddFab } from "@/components/add-transaction";
import { money, stats, useTransactions } from "@/lib/finance";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Grafik hisobotlar — Hisobchi" },
      {
        name: "description",
        content:
          "Oylik taqqoslash, 7 oylik trend, kunlik xarajat grafigi va kategoriyalar bo'yicha taqsimot.",
      },
      { property: "og:title", content: "Grafik hisobotlar — Hisobchi" },
      { property: "og:description", content: "Xarajatlaringizni grafiklarda tahlil qiling." },
    ],
  }),
  component: Insights,
});

function ChartTip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass num rounded-xl px-2.5 py-1.5 text-xs font-bold">
      {money(payload[0]!.value)}
    </div>
  );
}

function Insights() {
  const { txs } = useTransactions();
  const s = stats(txs);
  const total = s.byCategory.reduce((a, c) => a + c.value, 0) || 1;

  return (
    <PhoneShell>
      <ScreenHeader title="Hisobot" subtitle="Xarajatlaringizning to'liq tahlili" />

      <section
        className="rounded-3xl border border-hairline p-5"
        style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        <p className="font-display text-sm font-bold text-primary-foreground">Oylik taqqoslash</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] text-primary-foreground/70">Bu oy</p>
            <p className="num text-2xl font-extrabold text-primary-foreground">{money(s.expense)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-primary-foreground/70">O'tgan oy</p>
            <p className="num text-2xl font-extrabold text-primary-foreground/80">
              {money(s.prevExpense)}
            </p>
          </div>
        </div>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
          {s.deltaVsPrevMonth <= 0 ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <TrendingUp className="h-3 w-3" />
          )}
          {Math.abs(s.deltaVsPrevMonth)}%
        </span>
      </section>

      <section className="glass mt-4 rounded-3xl p-5">
        <p className="font-display text-sm font-bold">7 oylik trend</p>
        <div className="mt-3 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={s.trend} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Tooltip content={<ChartTip />} />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                fill="url(#trendFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass mt-4 rounded-3xl p-5">
        <p className="font-display text-sm font-bold">Oxirgi 7 kun</p>
        <div className="mt-3 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={s.daily} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Tooltip content={<ChartTip />} cursor={{ fill: "var(--glass)" }} />
              <Bar dataKey="spend" radius={[8, 8, 8, 8]} fill="var(--chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="glass mt-4 rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <p className="font-display text-sm font-bold">Kategoriyalar</p>
          <span className="text-[11px] text-muted-foreground">{s.byCategory.length} ta</span>
        </div>

        <div className="mt-2 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={s.byCategory}
                dataKey="value"
                nameKey="label"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                stroke="none"
              >
                {s.byCategory.map((c) => (
                  <Cell key={c.id} fill={c.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 space-y-3">
          {s.byCategory.map((c) => (
            <div key={c.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-semibold">
                  <span>{c.emoji}</span>
                  {c.label}
                </span>
                <span className="num font-bold">{money(c.value)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(c.value / total) * 100}%`, backgroundColor: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <AddFab />
    </PhoneShell>
  );
}
