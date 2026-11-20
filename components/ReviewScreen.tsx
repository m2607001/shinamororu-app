"use client";

import { useRef, useState } from "react";
import { QUESTIONS, REVIEW_COMMENTS } from "@/lib/data";

export function ReviewScreen({ onSubmit }: { onSubmit: (score: number) => void }) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(QUESTIONS.map(() => null));
  const [score, setScore] = useState<number | null>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const ready = answers.every((a) => a !== null);

  const answer = (i: number, v: boolean) => setAnswers((prev) => prev.map((a, j) => (j === i ? v : a)));

  const submit = () => {
    const n = answers.filter(Boolean).length;
    setScore(n);
    onSubmit(n);
    requestAnimationFrame(() => scoreRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  return (
    <>
      <h2>1日のふりかえり</h2>
      <p className="lead">寝る前に3つだけ。「はい」か「いいえ」で答えてね。</p>
      <div className="card">
        {QUESTIONS.map((q, i) => (
          <div className="q" key={i}>
            <div className="qtext">
              <span className="qnum">Q{i + 1}</span>
              {q}
            </div>
            <div className="yn">
              <button className={"yes" + (answers[i] === true ? " on" : "")} onClick={() => answer(i, true)}>
                はい
              </button>
              <button className={"no" + (answers[i] === false ? " on" : "")} onClick={() => answer(i, false)}>
                いいえ
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn primary" disabled={!ready} style={{ opacity: ready ? 1 : 0.5 }} onClick={submit}>
        ふりかえりを記録する
      </button>
      {score !== null && (
        <div className="card score" ref={scoreRef} style={{ marginTop: 14 }}>
          <div className="label">今日のスコア</div>
          <div className="big">{score} / 3</div>
          <p>{REVIEW_COMMENTS[score]}</p>
        </div>
      )}
    </>
  );
}
