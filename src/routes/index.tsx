import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/phone-shell";
import { AddFab, AddTransactionSheet, QuickWidgets } from "@/components/add-transaction";
import { TxRow } from "@/components/tx-list";
import { money, stats, useTransactions } from "@/lib/finance";
import { ArrowDownRight, ArrowUpRight, Bell, Plus, Repeat, TrendingDown, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hisobchi — Oylik daromad va xarajat nazorati" },
      {
        name: "description",
        content:
          "Hisobchi — daromad va xarajatlarni kunlik kuzatish, vidjetlar bilan tez kiritish va grafik hisobotlar uchun qulay mobil ilova.",
      },
      { property: "og:title", content: "Hisobchi — Oylik budjet nazorati" },
      {
        property: "og:description",
        content: "Daromad, xarajat va grafik hisobotlar bitta shaffof dizaynli mobil ilovada.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { txs, remove } = useTransactions();
  const s = stats(txs);
  const recent = txs
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 5);

  return (
    <PhoneShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Salom 👋</p>
          <p className="font-display text-lg font-bold">Hisobchi</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="glass-tap flex h-11 w-11 items-center justify-center rounded-full" aria-label="Bildirishnomalar">
            <Bell className="h-5 w-5" />
          </button>
          <div className="glass flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold">
            AS
          </div>
        </div>
      </div>

      <section className="glass rounded-3xl p-5">
        <p className="text-xs text-muted-foreground">Oylik balans</p>
        <p className="num mt-1 text-4xl font-extrabold text-primary">{money(s.balance)}</p>
        <p className="text-xs text-muted-foreground">so'm</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ArrowDownRight className="h-3.5 w-3.5 text-income" /> Daromad
            </div>
            <p className="num mt-1 text-base font-bold">{money(s.income)}</p>
          </div>
          <div className="glass rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ArrowUpRight className="h-3.5 w-3.5 text-destructive" /> Xarajat
            </div>
            <p className="num mt-1 text-base font-bold">{money(s.expense)}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Byudjetdan ishlatildi</span>
            <span className="font-semibold text-foreground">{s.usedPct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${s.usedPct}%`, backgroundImage: "var(--gradient-primary)" }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Jamg'arma darajasi: <span className="font-semibold text-primary">{s.savingRate}%</span>
          </p>
        </div>
      </section>

      <section
        className="mt-4 rounded-3xl border border-hairline p-5"
        style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        <p className="text-xs font-semibold text-primary-foreground/70">Bugungi xarajat</p>
        <p className="num mt-1 text-3xl font-extrabold text-primary-foreground">
          {money(s.todaySpend)}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
            {s.deltaVsYesterday <= 0 ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            {Math.abs(s.deltaVsYesterday)}% kechagiga nisbatan
          </span>
          <span className="text-[11px] text-primary-foreground/80">
            {s.topCategory ? `Ko'proq: ${s.topCategory.label}` : "Ma'lumot yo'q"}
          </span>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-2">
        <AddTransactionSheet
          trigger={
            <button className="glass-tap flex flex-col items-center gap-1 rounded-2xl py-3.5">
              <Plus className="h-5 w-5 text-primary" />
              <span className="text-[11px] font-semibold">Qo'shish</span>
            </button>
          }
        />
        <Link to="/transactions" className="glass-tap flex flex-col items-center gap-1 rounded-2xl py-3.5">
          <Repeat className="h-5 w-5 text-primary" />
          <span className="text-[11px] font-semibold">Amallar</span>
        </Link>
        <Link to="/insights" className="glass-tap flex flex-col items-center gap-1 rounded-2xl py-3.5">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-[11px] font-semibold">Hisobot</span>
        </Link>
      </section>

      <section className="mt-5">
        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Tezkor vidjetlar
        </p>
        <QuickWidgets />
      </section>

      <section className="mt-5">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            So'nggi amallar
          </p>
          <Link to="/transactions" className="text-[11px] font-semibold text-primary">
            Barchasi
          </Link>
        </div>
        <div className="glass divide-y divide-border rounded-3xl px-4">
          {recent.map((t) => (
            <TxRow key={t.id} tx={t} onDelete={remove} />
          ))}
        </div>
      </section>

      <AddFab />
    </PhoneShell>
  );
}
