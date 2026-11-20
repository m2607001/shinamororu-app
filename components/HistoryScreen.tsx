"use client";

import { SAMPLE_LOG, SAMPLE_SCORES, WEEKDAYS, type LogEntry } from "@/lib/data";
import { useToday } from "@/lib/useToday";

type Props = { todayLog: LogEntry[]; reviewed: number | null };

function streak(reviewed: number | null) {
  const arr = [...SAMPLE_SCORES];
  if (reviewed != null) arr.push(reviewed);
  let c = 0;
  for (let i = arr.length - 1; i >= 0 && arr[i] > 0; i--) c++;
  return c;
}

export function HistoryScreen({ todayLog, reviewed }: Props) {
  const today = useToday();
  const all = [...todayLog, ...SAMPLE_LOG];
  const days = SAMPLE_SCORES.filter((v) => v > 0).length + (reviewed ? 1 : 0);

  return (
    <>
      <h2>これまでの記録</h2>
      <p className="lead">ふりかえりの「はい」の数で色が濃くなります。</p>
      <div className="card">
        <div className="label">この7日間</div>
        <div className="week">
          {[6, 5, 4, 3, 2, 1, 0].map((i) => {
            const v = i === 0 ? reviewed : SAMPLE_SCORES[6 - i];
            let label = "";
            if (i === 0) label = "今日";
            else if (today) {
              const dd = new Date(today);
              dd.setDate(dd.getDate() - i);
              label = WEEKDAYS[dd.getDay()];
            }
            return (
              <div className="day" key={i}>
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
            <div className="n">{all.filter((l) => l.done).length}</div>
            <div className="l">やったこと</div>
          </div>
          <div className="stat">
            <div className="n">{days}日</div>
            <div className="l">充実した日</div>
          </div>
          <div className="stat">
            <div className="n">{streak(reviewed)}日</div>
            <div className="l">連続記録</div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="label">やったこと</div>
        {all.map((l, i) => (
          <div className="logitem" key={i}>
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
      <p className="proto">※プロトタイプのため、記録は画面を閉じると消えます（過去分はサンプルです）</p>
    </>
  );
}
