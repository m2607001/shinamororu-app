"use client";

export type Tab = "gacha" | "suggest" | "review" | "history";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "gacha", label: "ガチャ", icon: <><circle cx="12" cy="10" r="7" /><path d="M5 10h14M8 21h8M12 17v4" /></> },
  { key: "suggest", label: "提案", icon: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /> },
  { key: "review", label: "ふりかえり", icon: <><path d="M9 11l3 3 8-8" /><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9" /></> },
  { key: "history", label: "記録", icon: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></> },
];

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav>
      {TABS.map((t) => (
        <button key={t.key} className={tab === t.key ? "on" : ""} onClick={() => onChange(t.key)}>
          <svg viewBox="0 0 24 24">{t.icon}</svg>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
