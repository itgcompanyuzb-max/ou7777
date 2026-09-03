import { useCallback, useEffect, useState } from "react";

export type TxKind = "expense" | "income";

export type CategoryId =
  | "food"
  | "transport"
  | "shopping"
  | "home"
  | "health"
  | "fun"
  | "salary"
  | "other";

export type Tx = {
  id: string;
  kind: TxKind;
  title: string;
  amount: number;
  category: CategoryId;
  method: "Naqd" | "Karta" | "Bank";
  date: string; // ISO
};

export const CATEGORIES: Record<CategoryId, { label: string; emoji: string; chart: string }> = {
  food: { label: "Ovqat", emoji: "🍕", chart: "var(--chart-1)" },
  transport: { label: "Transport", emoji: "🚕", chart: "var(--chart-2)" },
  shopping: { label: "Xarid", emoji: "🛍️", chart: "var(--chart-3)" },
  home: { label: "Uy", emoji: "🏠", chart: "var(--chart-4)" },
  health: { label: "Salomatlik", emoji: "💊", chart: "var(--chart-5)" },
  fun: { label: "Ko'ngilxushlik", emoji: "🎬", chart: "var(--chart-2)" },
  salary: { label: "Ish haqi", emoji: "💰", chart: "var(--chart-1)" },
  other: { label: "Boshqa", emoji: "✨", chart: "var(--chart-3)" },
};

const KEY = "hisobchi.tx.v1";

function iso(daysAgo: number, hour = 12, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const SEED: Tx[] = [
  { id: "s1", kind: "income", title: "Oylik ish haqi", amount: 9000000, category: "salary", method: "Bank", date: iso(6, 10, 5) },
  { id: "s2", kind: "expense", title: "Kofe & snack", amount: 42000, category: "food", method: "Karta", date: iso(0, 9, 30) },
  { id: "s3", kind: "expense", title: "Yandex Go", amount: 28000, category: "transport", method: "Karta", date: iso(0, 14, 20) },
  { id: "s4", kind: "expense", title: "Korzinka", amount: 310000, category: "food", method: "Karta", date: iso(1, 20, 40) },
  { id: "s5", kind: "expense", title: "Krossovka", amount: 890000, category: "shopping", method: "Karta", date: iso(2, 15, 50) },
  { id: "s6", kind: "expense", title: "Kommunal", amount: 460000, category: "home", method: "Bank", date: iso(3, 11, 10) },
  { id: "s7", kind: "expense", title: "Kino", amount: 90000, category: "fun", method: "Naqd", date: iso(4, 21, 0) },
  { id: "s8", kind: "expense", title: "Dorixona", amount: 120000, category: "health", method: "Naqd", date: iso(5, 18, 25) },
  { id: "s9", kind: "expense", title: "Tushlik", amount: 75000, category: "food", method: "Naqd", date: iso(8, 13, 15) },
  { id: "s10", kind: "expense", title: "Metro", amount: 34000, category: "transport", method: "Karta", date: iso(12, 8, 45) },
  { id: "s11", kind: "income", title: "Freelance loyiha", amount: 1800000, category: "other", method: "Bank", date: iso(34, 16, 0) },
  { id: "s12", kind: "expense", title: "Internet", amount: 220000, category: "home", method: "Karta", date: iso(36, 9, 0) },
  { id: "s13", kind: "expense", title: "Restoran", amount: 540000, category: "food", method: "Karta", date: iso(40, 20, 30) },
  { id: "s14", kind: "expense", title: "Kiyim", amount: 700000, category: "shopping", method: "Karta", date: iso(48, 17, 0) },
  { id: "s15", kind: "expense", title: "Taksi", amount: 65000, category: "transport", method: "Naqd", date: iso(70, 22, 10) },
];

function read(): Tx[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as Tx[];
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
}

const listeners = new Set<(t: Tx[]) => void>();
let memory: Tx[] | null = null;

function publish(next: Tx[]) {
  memory = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(next));
}

export function useTransactions() {
  const [txs, setTxs] = useState<Tx[]>(SEED);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = memory ?? read();
    memory = initial;
    setTxs(initial);
    setReady(true);
    const l = (t: Tx[]) => setTxs(t);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const add = useCallback((tx: Omit<Tx, "id">) => {
    const next = [{ ...tx, id: crypto.randomUUID() }, ...(memory ?? read())];
    publish(next);
  }, []);

  const remove = useCallback((id: string) => {
    publish((memory ?? read()).filter((t) => t.id !== id));
  }, []);

  return { txs, ready, add, remove };
}

export function money(n: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mln`;
    if (Math.abs(n) >= 1_000) return `${Math.round(n / 1_000)} ming`;
  }
  return new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(Math.round(n));
}

export function timeOf(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}

const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

export function dayLabel(isoStr: string) {
  const d = new Date(isoStr);
  const today = new Date();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return "Bugun";
  if (same(d, y)) return "Kecha";
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export function stats(txs: Tx[]) {
  const now = new Date();
  const thisMonth = txs.filter((t) => monthKey(new Date(t.date)) === monthKey(now));
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = txs.filter((t) => monthKey(new Date(t.date)) === monthKey(prevDate));

  const sum = (list: Tx[], kind: TxKind) =>
    list.filter((t) => t.kind === kind).reduce((a, t) => a + t.amount, 0);

  const income = sum(thisMonth, "income");
  const expense = sum(thisMonth, "expense");
  const prevExpense = sum(prevMonth, "expense");

  const isToday = (t: Tx) => new Date(t.date).toDateString() === now.toDateString();
  const yDate = new Date();
  yDate.setDate(now.getDate() - 1);
  const todaySpend = txs.filter((t) => t.kind === "expense" && isToday(t)).reduce((a, t) => a + t.amount, 0);
  const yesterdaySpend = txs
    .filter((t) => t.kind === "expense" && new Date(t.date).toDateString() === yDate.toDateString())
    .reduce((a, t) => a + t.amount, 0);

  const byCategory = Object.entries(
    thisMonth
      .filter((t) => t.kind === "expense")
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category] = (acc[t.category] ?? 0) + t.amount;
        return acc;
      }, {}),
  )
    .map(([id, value]) => ({
      id: id as CategoryId,
      value,
      label: CATEGORIES[id as CategoryId]?.label ?? id,
      emoji: CATEGORIES[id as CategoryId]?.emoji ?? "✨",
      color: CATEGORIES[id as CategoryId]?.chart ?? "var(--chart-1)",
    }))
    .sort((a, b) => b.value - a.value);

  const trend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
    const key = monthKey(d);
    const spend = txs
      .filter((t) => t.kind === "expense" && monthKey(new Date(t.date)) === key)
      .reduce((a, t) => a + t.amount, 0);
    return { month: MONTHS[d.getMonth()], spend };
  });

  const daily = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    const spend = txs
      .filter((t) => t.kind === "expense" && new Date(t.date).toDateString() === d.toDateString())
      .reduce((a, t) => a + t.amount, 0);
    return { day: ["Yak", "Du", "Se", "Cho", "Pay", "Ju", "Sha"][d.getDay()], spend };
  });

  const balance = income - expense;
  const savingRate = income > 0 ? Math.max(0, Math.round((balance / income) * 100)) : 0;
  const usedPct = income > 0 ? Math.min(100, Math.round((expense / income) * 100)) : 0;
  const deltaVsYesterday =
    yesterdaySpend > 0 ? Math.round(((todaySpend - yesterdaySpend) / yesterdaySpend) * 100) : 0;
  const deltaVsPrevMonth =
    prevExpense > 0 ? Math.round(((expense - prevExpense) / prevExpense) * 100) : 0;

  return {
    income,
    expense,
    prevExpense,
    balance,
    savingRate,
    usedPct,
    todaySpend,
    deltaVsYesterday,
    deltaVsPrevMonth,
    byCategory,
    trend,
    daily,
    topCategory: byCategory[0],
  };
}
