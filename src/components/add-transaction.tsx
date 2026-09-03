import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { CATEGORIES, money, useTransactions, type CategoryId, type TxKind } from "@/lib/finance";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import type { ReactNode } from "react";

const QUICK: { label: string; amount: number; category: CategoryId; title: string }[] = [
  { label: "Kofe", amount: 25000, category: "food", title: "Kofe" },
  { label: "Taksi", amount: 30000, category: "transport", title: "Taksi" },
  { label: "Tushlik", amount: 60000, category: "food", title: "Tushlik" },
  { label: "Market", amount: 150000, category: "food", title: "Market" },
];

const METHODS = ["Karta", "Naqd", "Bank"] as const;

export function QuickWidgets() {
  const { add } = useTransactions();
  return (
    <div className="grid grid-cols-4 gap-2">
      {QUICK.map((q) => (
        <button
          key={q.label}
          onClick={() => {
            add({
              kind: "expense",
              title: q.title,
              amount: q.amount,
              category: q.category,
              method: "Karta",
              date: new Date().toISOString(),
            });
            toast.success(`${q.title} qo'shildi`, { description: `${money(q.amount)} so'm` });
          }}
          className="glass-tap flex flex-col items-center gap-1 rounded-2xl px-1 py-3"
        >
          <span className="text-lg">{CATEGORIES[q.category].emoji}</span>
          <span className="text-[11px] font-semibold">{q.label}</span>
          <span className="text-[10px] text-muted-foreground">{money(q.amount, { compact: true })}</span>
        </button>
      ))}
    </div>
  );
}

export function AddTransactionSheet({ trigger }: { trigger: ReactNode }) {
  const { add } = useTransactions();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<TxKind>("expense");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryId>("food");
  const [method, setMethod] = useState<(typeof METHODS)[number]>("Karta");

  const submit = () => {
    const value = Number(amount.replace(/\D/g, ""));
    if (!value) {
      toast.error("Summani kiriting");
      return;
    }
    add({
      kind,
      title: title.trim() || CATEGORIES[category].label,
      amount: value,
      category: kind === "income" ? "salary" : category,
      method,
      date: new Date().toISOString(),
    });
    toast.success(kind === "income" ? "Daromad qo'shildi" : "Xarajat qo'shildi");
    setAmount("");
    setTitle("");
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="mx-auto max-w-[430px] border-hairline bg-popover/80 backdrop-blur-2xl">
        <div className="px-5 pb-8 pt-2">
          <h2 className="font-display text-lg font-bold">Yangi yozuv</h2>

          <div className="glass mt-4 grid grid-cols-2 gap-1 rounded-full p-1">
            {(["expense", "income"] as TxKind[]).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={[
                  "rounded-full py-2 text-sm font-semibold transition-colors",
                  kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {k === "expense" ? "Xarajat" : "Daromad"}
              </button>
            ))}
          </div>

          <div className="glass mt-4 rounded-3xl p-5 text-center">
            <input
              inputMode="numeric"
              value={amount ? money(Number(amount.replace(/\D/g, ""))) : ""}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="num w-full bg-transparent text-center text-4xl font-bold outline-none placeholder:text-muted-foreground"
            />
            <p className="mt-1 text-xs text-muted-foreground">so'm</p>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Izoh (masalan: Korzinka)"
            className="glass mt-3 w-full rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />

          {kind === "expense" ? (
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {(Object.keys(CATEGORIES) as CategoryId[])
                .filter((c) => c !== "salary")
                .map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={[
                      "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors",
                      category === c
                        ? "bg-primary/25 text-primary ring-1 ring-primary/40"
                        : "glass-tap text-muted-foreground",
                    ].join(" ")}
                  >
                    <span>{CATEGORIES[c].emoji}</span>
                    {CATEGORIES[c].label}
                  </button>
                ))}
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-3 gap-2">
            {METHODS.map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={[
                  "rounded-2xl py-2.5 text-xs font-semibold transition-colors",
                  method === m ? "bg-primary/25 text-primary ring-1 ring-primary/40" : "glass-tap",
                ].join(" ")}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={submit}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold text-primary-foreground active:scale-[0.98]"
            style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Check className="h-4 w-4" />
            Saqlash
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function AddFab() {
  return (
    <AddTransactionSheet
      trigger={
        <button
          aria-label="Yangi yozuv"
          className="fixed bottom-28 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground active:scale-95"
          style={{ backgroundImage: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <Plus className="h-6 w-6" strokeWidth={2.6} />
        </button>
      }
    />
  );
}
