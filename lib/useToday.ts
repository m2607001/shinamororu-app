"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => new Date().toDateString();
const getServerSnapshot = () => null;

/** クライアントでのみ今日の日付を返す（サーバー描画時は null）。ハイドレーションずれを防ぐ。 */
export function useToday(): Date | null {
  const key = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return key ? new Date(key) : null;
}
