"use client";

import { WEEKDAYS } from "@/lib/data";
import { dateKey, type Records } from "@/lib/store";

type Props = { records: Records | null; today: Date | null };

const daysAgo = (today: Date, n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
};

const whenLabel = (n: number) => (n === 0 ? "今日" : n === 1 ? "昨日" : `${n}日前`);

export function HistoryScreen({ records, today }: Props) {
  const days = records?.days ?? {};
  const scoreOn = (n: number) => (today ? (days[dateKey(daysAgo(today, n))]?.score ?? null) : null);

  // やったこと：全日ぶんを新しい順に
  const logs = today
    ? Object.entries(days)
        .flatMap(([key, d]) => {
          const n = Math.round((new Date(dateKey(today)).getTime() - new Date(key).getTime()) / 86400000);
          return d.log.map((l) => ({ ...l, when: whenLabel(n) }));
        })
        .sort((a, b) => b.at - a.at)
    : [];

  const doneCount = logs.filter((l) => l.done).length;
  const goodDays = Object.values(days).filter((d) => (d.score ?? 0) > 0).length;

  // 連続記録：今日（未記録なら昨日）からさかのぼって、スコア1以上が続いた日数
  let streak = 0;
  for (let n = scoreOn(0) == null ? 1 : 0; (scoreOn(n) ?? 0) > 0; n++) streak++;

  return (
    <>
      <h2>これまでの記録</h2>
      <p className="lead">ふりかえりの「はい」の数で色が濃くなります。</p>
      <div className="card">
        <div className="label">この7日間</div>
        <div className="week">
          {[6, 5, 4, 3, 2, 1, 0].map((n) => {
            const v = scoreOn(n);
            const label = n === 0 ? "今日" : today ? WEEKDAYS[daysAgo(today, n).getDay()] : "";
            return (
              <div className="day" key={n}>
                {label}
                <div className={`cell lv${v ?? 0}`}>{v == null ? "−" : v}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card">
        <div className="stats">
          <div className="stat">
            <div className="n">{doneCount}</div>
            <div className="l">やったこと</div>
          </div>
          <div className="stat">
            <div className="n">{goodDays}日</div>
            <div className="l">充実した日</div>
          </div>
          <div className="stat">
            <div className="n">{streak}日</div>
            <div className="l">連続記録</div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="label">やったこと</div>
        {logs.length === 0 && (
          <p className="note" style={{ padding: "12px 0" }}>
            まだ記録がありません。ガチャか提案で「やってみる」を選ぶとここに残ります。
          </p>
        )}
        {logs.map((l) => (
          <div className="logitem" key={l.at + l.title}>
            <div className="ic">{l.icon}</div>
            <div>
              <div className="t">{l.title}</div>
              <div className="s">
                {l.when}・{l.src}から
              </div>
            </div>
            <span className={"badge " + (l.done ? "b-done" : "b-skip")}>{l.done ? "やった" : "見送り"}</span>
          </div>
        ))}
      </div>
      <p className="proto">※記録はこの端末のブラウザに保存されます</p>
    </>
  );
}
