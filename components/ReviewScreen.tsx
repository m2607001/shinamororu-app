"use client";

import { useRef } from "react";
import { QUESTIONS, REVIEW_COMMENTS } from "@/lib/data";

type Props = {
  answers: (boolean | null)[];
  score: number | null;
  onAnswer: (i: number, v: boolean) => void;
  onSubmit: (score: number) => void;
};

export function ReviewScreen({ answers, score, onAnswer, onSubmit }: Props) {
  const scoreRef = useRef<HTMLDivElement>(null);
  const ready = answers.every((a) => a !== null);

  const submit = () => {
    onSubmit(answers.filter(Boolean).length);
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
              <button className={"yes" + (answers[i] === true ? " on" : "")} onClick={() => onAnswer(i, true)}>
                はい
              </button>
              <button className={"no" + (answers[i] === false ? " on" : "")} onClick={() => onAnswer(i, false)}>
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
