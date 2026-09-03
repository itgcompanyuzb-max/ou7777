import { CATEGORIES, dayLabel, money, timeOf, type Tx } from "@/lib/finance";
import { Trash2 } from "lucide-react";

export function TxRow({ tx, onDelete }: { tx: Tx; onDelete?: (id: string) => void }) {
  const cat = CATEGORIES[tx.category];
  const income = tx.kind === "income";
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-base">
        {cat.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{tx.title}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {cat.label} • {tx.method}
        </p>
      </div>
      <div className="text-right">
        <p className={["num text-sm font-bold", income ? "text-income" : ""].join(" ")}>
          {income ? "+" : "−"}
          {money(tx.amount)}
        </p>
        <p className="text-[11px] text-muted-foreground">{timeOf(tx.date)}</p>
      </div>
      {onDelete ? (
        <button
          aria-label="O'chirish"
          onClick={() => onDelete(tx.id)}
          className="ml-1 rounded-full p-2 text-muted-foreground active:scale-90"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export function GroupedTxList({ txs, onDelete }: { txs: Tx[]; onDelete?: (id: string) => void }) {
  const groups = txs.reduce<Record<string, Tx[]>>((acc, t) => {
    const key = dayLabel(t.date);
    (acc[key] ||= []).push(t);
    return acc;
  }, {});

  if (txs.length === 0) {
    return (
      <div className="glass rounded-3xl p-8 text-center text-sm text-muted-foreground">
        Hozircha yozuv yo'q
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([label, list]) => (
        <section key={label}>
          <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="glass divide-y divide-border rounded-3xl px-4">
            {list.map((t) => (
              <TxRow key={t.id} tx={t} onDelete={onDelete} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
