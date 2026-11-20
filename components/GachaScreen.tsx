"use client";

import { useRef, useState } from "react";
import { ACTS, GACHA_PER_DAY, GENRE_ITEMS, GENRES, minText, pick, type Activity, type GenreFilter } from "@/lib/data";
import { Chips } from "./Chips";
import { Modal } from "./Modal";

const BALL_POS = [
  [20, 120], [62, 138], [106, 128], [150, 140], [170, 98], [40, 78],
  [90, 86], [130, 64], [70, 40], [118, 22], [16, 34], [160, 40],
];

type Props = {
  remain: number;
  onSpin: () => void;
  onDo: (a: Activity) => void;
};

export function GachaScreen({ remain, onSpin, onDo }: Props) {
  const [genre, setGenre] = useState<GenreFilter>("all");
  const [spinning, setSpinning] = useState(false);
  const handleRef = useRef<HTMLButtonElement>(null);
  const [dropColor, setDropColor] = useState<string | null>(null);
  const [result, setResult] = useState<Activity | null>(null);
  const timers = useRef<number[]>([]);

  const cols =
    genre === "all"
      ? (Object.keys(GENRES) as GenreFilter[]).slice(1).map((k) => GENRES[k].color)
      : [GENRES[genre].color];

  const spin = () => {
    if (remain <= 0 || spinning) return;
    onSpin();
    const pool = ACTS.filter((a) => genre === "all" || a.g === genre);
    const act = pick(pool);
    handleRef.current?.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 600 });
    setSpinning(true);
    setDropColor(null);
    timers.current.forEach(clearTimeout);
    timers.current = [
      window.setTimeout(() => {
        setSpinning(false);
        setDropColor(GENRES[act.g].color);
      }, 800),
      window.setTimeout(() => setResult(act), 1500),
    ];
  };

  const close = () => {
    setResult(null);
    setDropColor(null);
  };

  // remain は spin 時点で親が減らしているので、モーダル表示時の値がそのまま「残り回数」
  return (
    <>
      <h2>ヒマつぶしガチャ</h2>
      <p className="lead">迷ったらまわすだけ。今日やることをガチャが決めます。</p>

      <div className="card">
        <div className="label">ジャンルをえらぶ</div>
        <Chips items={GENRE_ITEMS} value={genre} onChange={setGenre} />
      </div>

      <div className="machine">
        <div className={"globe" + (spinning ? " shake" : "")}>
          {BALL_POS.map(([x, y], i) => (
            <div
              key={i}
              className="ball"
              style={{ left: x, top: y, background: cols[i % cols.length], animationDelay: `${i * 0.03}s` }}
            />
          ))}
        </div>
        <div className="base">
          <button
            ref={handleRef}
            className="handle"
            aria-label="ガチャをまわす"
            disabled={remain <= 0}
            onClick={spin}
          />
          <div className="turn">まわす</div>
          <div className="slot" />
          {dropColor && <div className="drop show" style={{ background: dropColor }} />}
        </div>
      </div>

      <div className="remain">
        今日の残り
        <div className="dots">
          {Array.from({ length: GACHA_PER_DAY }, (_, i) => (
            <i key={i} className={i < GACHA_PER_DAY - remain ? "used" : ""} />
          ))}
        </div>
        <span>{remain}回</span>
      </div>
      <p className="note">ガチャは1日3回まで。引きすぎて迷わないための制限です。</p>

      {result && (
        <Modal onClose={close}>
          <div className="icon">{result.icon}</div>
          <span className="tag" style={{ background: GENRES[result.g].color }}>
            {GENRES[result.g].name}
          </span>
          <div className="title">{result.title}</div>
          <div className="ask">…するのはいかがでしょうか？</div>
          <div className="meta">目安 {minText(result.min)}</div>
          <button
            className="btn primary"
            onClick={() => {
              onDo(result);
              close();
            }}
          >
            やってみる！
          </button>
          {remain > 0 ? (
            <button
              className="btn ghost"
              onClick={() => {
                close();
                window.setTimeout(spin, 250);
              }}
            >
              もう一回まわす（残り{remain}回）
            </button>
          ) : (
            <p className="note" style={{ marginTop: 12 }}>
              今日のガチャはおしまい。
              <br />
              まずはこれをやってみよう！
            </p>
          )}
          <button className="btn ghost" style={{ boxShadow: "none", border: "none", color: "var(--sub)", padding: 8 }} onClick={close}>
            とじる
          </button>
        </Modal>
      )}
    </>
  );
}
