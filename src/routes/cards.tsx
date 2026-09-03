import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneShell, ScreenHeader } from "@/components/phone-shell";
import { AddFab } from "@/components/add-transaction";
import { money, stats, useTransactions } from "@/lib/finance";
import { CreditCard, Plus } from "lucide-react";
import { toast } from "sonner";

type Card = { id: string; name: string; last4: string; kind: "Karta" | "Naqd" | "Bank" };

const DEFAULT_CARDS: Card[] = [
  { id: "c1", name: "Uzcard Asosiy", last4: "8412", kind: "Karta" },
  { id: "c2", name: "Humo Jamg'arma", last4: "5567", kind: "Bank" },
  { id: "c3", name: "Naqd hamyon", last4: "—", kind: "Naqd" },
];

export const Route = createFileRoute("/cards")({
  head: () => ({
    meta: [
      { title: "Kartalar va hamyonlar — Hisobchi" },
      {
        name: "description",
        content: "Karta, bank va naqd hamyonlar bo'yicha xarajatlarni ajratib kuzatib boring.",
      },
      { property: "og:title", content: "Kartalar va hamyonlar — Hisobchi" },
      { property: "og:description", content: "Har bir to'lov usuli bo'yicha oylik xarajat." },
    ],
  }),
  component: Cards,
});

function Cards() {
  const { txs } = useTransactions();
  const s = stats(txs);
  const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS);
  const [name, setName] = useState("");

  const spentBy = (kind: Card["kind"]) =>
    txs
      .filter((t) => t.kind === "expense" && t.method === kind)
      .reduce((a, t) => a + t.amount, 0);

  return (
    <PhoneShell>
      <ScreenHeader title="Kartalar" subtitle={`Oylik balans: ${money(s.balance)} so'm`} />

      <div className="space-y-4">
        {cards.map((c, i) => (
          <article
            key={c.id}
            className="relative overflow-hidden rounded-3xl border border-hairline p-5"
            style={
              i === 0
                ? { backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }
                : { backgroundImage: "var(--gradient-card)", backdropFilter: "blur(24px)" }
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className={[
                    "text-xs font-semibold",
                    i === 0 ? "text-primary-foreground/70" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {c.kind}
                </p>
                <p
                  className={[
                    "font-display text-base font-bold",
                    i === 0 ? "text-primary-foreground" : "",
                  ].join(" ")}
                >
                  {c.name}
                </p>
              </div>
              <CreditCard
                className={["h-6 w-6", i === 0 ? "text-primary-foreground" : "text-primary"].join(" ")}
              />
            </div>

            <p
              className={[
                "num mt-6 text-lg tracking-[0.25em]",
                i === 0 ? "text-primary-foreground" : "",
              ].join(" ")}
            >
              •••• {c.last4}
            </p>

            <div className="mt-4 flex items-end justify-between">
              <span
                className={[
                  "text-[11px]",
                  i === 0 ? "text-primary-foreground/70" : "text-muted-foreground",
                ].join(" ")}
              >
                Sarflandi
              </span>
              <span
                className={["num text-xl font-extrabold", i === 0 ? "text-primary-foreground" : ""].join(
                  " ",
                )}
              >
                {money(spentBy(c.kind))}
              </span>
            </div>
          </article>
        ))}
      </div>

      <section className="glass mt-5 rounded-3xl p-5">
        <p className="font-display text-sm font-bold">Yangi karta qo'shish</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Karta nomi"
          className="glass mt-3 w-full rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={() => {
            if (!name.trim()) {
              toast.error("Karta nomini kiriting");
              return;
            }
            setCards((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                name: name.trim(),
                last4: String(Math.floor(1000 + Math.random() * 8999)),
                kind: "Karta",
              },
            ]);
            setName("");
            toast.success("Karta qo'shildi");
          }}
          className="glass-tap mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-primary"
        >
          <Plus className="h-4 w-4" /> Qo'shish
        </button>
      </section>

      <AddFab />
    </PhoneShell>
  );
}
