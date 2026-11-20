"use client";

type Props<T extends string | number> = {
  items: readonly (readonly [T, string])[];
  value: T;
  onChange: (v: T) => void;
};

export function Chips<T extends string | number>({ items, value, onChange }: Props<T>) {
  return (
    <div className="chips">
      {items.map(([v, label]) => (
        <button key={String(v)} className={"chip" + (v === value ? " on" : "")} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  );
}
