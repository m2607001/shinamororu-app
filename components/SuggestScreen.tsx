"use client";

import { useRef, useState, type ReactNode } from "react";
import { ACTS, GENRE_ITEMS, GENRES, TIME_ITEMS, minText, pick, type Activity, type GenreFilter } from "@/lib/data";
import { Chips } from "./Chips";

type Msg = { id: number; me: boolean; body: ReactNode; typing?: boolean };
type Phase = "start" | "waiting" | "choose" | "done";

const PHRASES: ((t: string) => ReactNode)[] = [
  (t) => <>それなら<b>「{t}」</b>するのはいかがでしょうか？</>,
  (t) => <><b>「{t}」</b>なんてどうでしょう？気分が変わるかも。</>,
  (t) => <>ちょっとした時間に<b>「{t}」</b>はいかがですか？</>,
];

const timeLabel = (t: number) => (t >= 60 ? (t === 180 ? "半日" : "1時間") : `${t}分`);

export function SuggestScreen({ onDo }: { onDo: (a: Activity) => void }) {
  const [genre, setGenre] = useState<GenreFilter>("all");
  const [time, setTime] = useState(30);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      me: false,
      body: <>ヒマしてる？<br />時間とジャンルを選んだら、ぼくが決めてあげるね。</>,
    },
  ]);
  const [phase, setPhase] = useState<Phase>("start");
  const [current, setCurrent] = useState<Activity | null>(null);
  const shown = useRef(new Set<string>());
  const nextId = useRef(1);

  const push = (...m: Omit<Msg, "id">[]) =>
    setMsgs((prev) => [...prev, ...m.map((x) => ({ ...x, id: nextId.current++ }))]);

  const suggest = (userLine?: string) => {
    if (userLine) push({ me: true, body: userLine });
    const typingId = nextId.current++;
    setMsgs((prev) => [...prev, { id: typingId, me: false, body: null, typing: true }]);
    setPhase("waiting");

    window.setTimeout(() => {
      const byGenre = (a: Activity) => genre === "all" || a.g === genre;
      let pool = ACTS.filter((a) => byGenre(a) && a.min <= time && !shown.current.has(a.title));
      if (!pool.length) {
        shown.current.clear();
        pool = ACTS.filter((a) => byGenre(a) && a.min <= time);
      }
      if (!pool.length) pool = ACTS.filter(byGenre);
      const a = pick(pool);
      shown.current.add(a.title);
      setCurrent(a);
      setMsgs((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                ...m,
                typing: false,
                body: (
                  <>
                    {a.icon} {pick(PHRASES)(a.title)}
                    <br />
                    <span style={{ fontSize: 12, color: "var(--sub)" }}>
                      {GENRES[a.g].name}・目安 {minText(a.min)}
                    </span>
                  </>
                ),
              }
            : m,
        ),
      );
      setPhase("choose");
    }, 700);
  };

  return (
    <>
      <h2>おまかせ提案</h2>
      <p className="lead">使える時間を選ぶと、ちょうどいいことを提案します。</p>
      <div className="card">
        <div className="label">使える時間は？</div>
        <Chips items={TIME_ITEMS} value={time} onChange={setTime} />
        <div className="label" style={{ marginTop: 14 }}>
          ジャンル
        </div>
        <Chips items={GENRE_ITEMS} value={genre} onChange={setGenre} />
      </div>

      <div className="chat">
        {msgs.map((m) => (
          <div key={m.id} className={"msg" + (m.me ? " me" : "")}>
            {!m.me && <div className="avatar">🐣</div>}
            <div className={"bubble" + (m.typing ? " typing" : "")}>
              {m.typing ? (
                <>
                  <span />
                  <span />
                  <span />
                </>
              ) : (
                m.body
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        {phase === "start" && (
          <button className="btn primary" onClick={() => suggest(`${timeLabel(time)}あいてる！`)}>
            提案してもらう
          </button>
        )}
        {phase === "choose" && current && (
          <>
            <button
              className="btn primary"
              onClick={() => {
                push(
                  { me: true, body: "いいね、やる！" },
                  { me: false, body: "いってらっしゃい！終わったら「ふりかえり」で今日をまとめてね。" },
                );
                onDo(current);
                setPhase("done");
              }}
            >
              いいね、やる！
            </button>
            <button className="btn ghost" onClick={() => suggest("ほかの案がいいな")}>
              ほかの案
            </button>
          </>
        )}
        {phase === "done" && (
          <button className="btn ghost" onClick={() => suggest()}>
            もう一度提案してもらう
          </button>
        )}
      </div>
    </>
  );
}
