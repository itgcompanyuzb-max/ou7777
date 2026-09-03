import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneShell, ScreenHeader } from "@/components/phone-shell";
import { GroupedTxList } from "@/components/tx-list";
import { AddFab } from "@/components/add-transaction";
import { money, stats, useTransactions } from "@/lib/finance";

const FILTERS = ["Barchasi", "Xarajat", "Daromad", "Karta", "Naqd", "Bank"] as const;

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Amallar tarixi — Hisobchi" },
      {
        name: "description",
        content: "Barcha daromad va xarajatlar tarixini kun bo'yicha guruhlangan ko'rinishda ko'rib chiqing.",
      },
      { property: "og:title", content: "Amallar tarixi — Hisobchi" },
      { property: "og:description", content: "Xarajat va daromadlarni filtrlar bilan kuzatish." },
    ],
  }),
  component: Transactions,
});

function Transactions() {
  const { txs, remove } = useTransactions();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Barchasi");
  const s = stats(txs);

  const filtered = txs
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .filter((t) => {
      if (filter === "Barchasi") return true;
      if (filter === "Xarajat") return t.kind === "expense";
      if (filter === "Daromad") return t.kind === "income";
      return t.method === filter;
    });

  return (
    <PhoneShell>
      <ScreenHeader title="Amallar" subtitle={`Bu oyda ${money(s.expense)} so'm xarajat`} />

      <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
              filter === f
                ? "bg-primary/25 text-primary ring-1 ring-primary/40"
                : "glass-tap text-muted-foreground",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
      </div>

      <GroupedTxList txs={filtered} onDelete={remove} />
      <AddFab />
    </PhoneShell>
  );
}
