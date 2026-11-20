"use client";

import { useRef, useState } from "react";
import { CHANGELOG, GACHA_PER_DAY, WEEKDAYS, type Activity, type LogEntry } from "@/lib/data";
import { useToday } from "@/lib/useToday";
import { GachaScreen } from "./GachaScreen";
import { HistoryScreen } from "./HistoryScreen";
import { Modal } from "./Modal";
import { ReviewScreen } from "./ReviewScreen";
import { SuggestScreen } from "./SuggestScreen";
import { TabBar, type Tab } from "./TabBar";

export function AppShell() {
  const today = useToday();
  const [tab, setTab] = useState<Tab>("gacha");
  const [remain, setRemain] = useState(GACHA_PER_DAY);
  const [todayLog, setTodayLog] = useState<LogEntry[]>([]);
  const [reviewed, setReviewed] = useState<number | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOn, setToastOn] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);
  const mainRef = useRef<HTMLElement>(null);

  const toast = (m: string) => {
    setToastMsg(m);
    setToastOn(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastOn(false), 1800);
  };

  const addLog = (a: Activity, src: LogEntry["src"]) =>
    setTodayLog((prev) => [{ icon: a.icon, title: a.title, when: "今日", src, done: true }, ...prev]);

  const changeTab = (t: Tab) => {
    setTab(t);
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  };

  const screen = (key: Tab) => "screen" + (tab === key ? " active" : "");

  return (
    <div className="phone">
      <header>
        <div className="logo">
          きょう<span>ナニ</span>する？
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button className="ver" onClick={() => setShowLog(true)}>
            v{CHANGELOG[0].v}
          </button>
          <div className="date">
            {today ? `${today.getMonth() + 1}/${today.getDate()}（${WEEKDAYS[today.getDay()]}）` : " "}
          </div>
        </div>
      </header>

      <main ref={mainRef}>
        {/* タブを切り替えても各画面の状態が残るよう、全画面を常にマウントしておく */}
        <section className={screen("gacha")}>
          <GachaScreen
            remain={remain}
            onSpin={() => setRemain((r) => r - 1)}
            onDo={(a) => {
              addLog(a, "ガチャ");
              toast("やることリストに追加しました");
            }}
          />
        </section>
        <section className={screen("suggest")}>
          <SuggestScreen onDo={(a) => addLog(a, "提案")} />
        </section>
        <section className={screen("review")}>
          <ReviewScreen
            onSubmit={(n) => {
              setReviewed(n);
              toast("ふりかえりを記録しました");
            }}
          />
        </section>
        <section className={screen("history")}>
          <HistoryScreen todayLog={todayLog} reviewed={reviewed} />
        </section>
      </main>

      <TabBar tab={tab} onChange={changeTab} />

      {showLog && (
        <Modal onClose={() => setShowLog(false)}>
          <div className="title" style={{ fontSize: 18 }}>
            更新履歴
          </div>
          <div className="clog">
            {CHANGELOG.map((c) => (
              <div className="v" key={c.v}>
                <div className="vh">
                  <span className="vn">v{c.v}</span>
                  <span className="vd">{c.date}</span>
                </div>
                <ul>
                  {c.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button className="btn ghost" onClick={() => setShowLog(false)}>
            とじる
          </button>
        </Modal>
      )}

      <div className={"toast" + (toastOn ? " show" : "")}>{toastMsg}</div>
    </div>
  );
}
