"use client";

import { useSyncExternalStore } from "react";
import { GACHA_PER_DAY, QUESTIONS, type LogEntry } from "./data";

/** 1日ぶんの記録 */
export type DayRecord = {
  remain: number; // ガチャの残り回数
  log: (Omit<LogEntry, "when"> & { at: number })[]; // やったこと（at = 追加した時刻 ms）
  answers: (boolean | null)[]; // ふりかえりの回答
  score: number | null; // ふりかえりのスコア（未記録は null）
};

export type Records = { version: 1; days: Record<string, DayRecord> };

const KEY = "kyou-nani:records";
const EMPTY: Records = { version: 1, days: {} };

export const emptyDay = (): DayRecord => ({
  remain: GACHA_PER_DAY,
  log: [],
  answers: QUESTIONS.map(() => null),
  score: null,
});

/** ローカル日付の YYYY-MM-DD */
export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

let cache: Records | null = null;
const listeners = new Set<() => void>();

function read(): Records {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Records) : null;
    return parsed?.version === 1 && parsed.days ? parsed : EMPTY;
  } catch {
    return EMPTY; // プライベートモード等で読めない場合は空のまま動かす
  }
}

function getSnapshot(): Records {
  if (!cache) cache = read();
  return cache;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // 別タブでの変更も反映する
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** 保存済みの記録。サーバー描画時は null。 */
export function useRecords(): Records | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** 指定日の記録を更新して保存する */
export function updateDay(key: string, fn: (d: DayRecord) => DayRecord) {
  const cur = getSnapshot();
  cache = { ...cur, days: { ...cur.days, [key]: fn(cur.days[key] ?? emptyDay()) } };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // 保存できなくても画面上は更新する
  }
  listeners.forEach((l) => l());
}
