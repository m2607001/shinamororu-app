export type GenreKey = "indoor" | "outdoor" | "study" | "relax" | "move";
export type GenreFilter = "all" | GenreKey;

export type Activity = {
  g: GenreKey;
  icon: string;
  title: string;
  min: number;
};

export type LogEntry = {
  icon: string;
  title: string;
  when: string;
  src: "ガチャ" | "提案";
  done: boolean;
};

// 更新履歴（改良のたびに先頭へ追加）
export const CHANGELOG: { v: string; date: string; items: string[] }[] = [
  {
    v: "1.2",
    date: "2026/11/20",
    items: ["Next.js のコンポーネント構成に作り直し（見た目・動きは v1.1 と同じ）"],
  },
  {
    v: "1.1",
    date: "2026/11/20",
    items: ["ヘッダーにバージョン表示を追加", "バージョンをタップすると更新履歴が見られるように"],
  },
  {
    v: "1.0",
    date: "2026/11/13",
    items: [
      "初版リリース（見た目確認用プロトタイプ）",
      "ガチャ機能：ジャンル選択つき・1日3回まで",
      "おまかせ提案：使える時間とジャンルで絞り込み、チャット形式で提案",
      "1日のふりかえり：はい／いいえの3問とスコア表示",
      "記録画面：7日間のスコア・やったこと一覧（過去分はサンプル）",
    ],
  },
];

export const GENRES: Record<GenreFilter, { name: string; color: string }> = {
  all: { name: "すべて", color: "#3A3340" },
  indoor: { name: "インドア", color: "#5AA9F7" },
  outdoor: { name: "アウトドア", color: "#4CC9A6" },
  study: { name: "勉強・成長", color: "#9B87F5" },
  relax: { name: "リラックス", color: "#E85D9A" },
  move: { name: "体を動かす", color: "#FFB347" },
};

export const GENRE_ITEMS = (Object.keys(GENRES) as GenreFilter[]).map(
  (k) => [k, GENRES[k].name] as const,
);

export const TIME_ITEMS = [
  [15, "15分"],
  [30, "30分"],
  [60, "1時間"],
  [180, "半日"],
] as const;

export const ACTS: Activity[] = (
  [
    ["indoor", "📚", "気になってた本を30ページ読む", 30],
    ["indoor", "🎬", "前から観たかった映画を1本観る", 120],
    ["indoor", "🍳", "冷蔵庫にあるもので1品つくる", 40],
    ["indoor", "🧹", "部屋の机まわりだけ片付ける", 20],
    ["indoor", "🎨", "スマホで写真を撮って色を加工してみる", 20],
    ["indoor", "🧩", "パズルゲームを1面クリアする", 15],
    ["indoor", "✍️", "好きなものを10個ノートに書き出す", 15],
    ["indoor", "🎧", "知らないアーティストのアルバムを1枚聴く", 45],
    ["outdoor", "🚶", "近所を知らない道で15分散歩する", 15],
    ["outdoor", "☕", "行ったことのないカフェに入ってみる", 60],
    ["outdoor", "🌳", "公園のベンチでぼーっとする", 20],
    ["outdoor", "📷", "外で「青いもの」を5つ撮影する", 30],
    ["outdoor", "🏪", "コンビニの新商品を1つ買ってみる", 15],
    ["outdoor", "📖", "図書館で表紙だけで本を選ぶ", 60],
    ["outdoor", "🚲", "自転車でとなり町まで行ってみる", 120],
    ["study", "🔤", "英単語を10個だけ覚える", 15],
    ["study", "💻", "授業の復習ノートを1ページまとめる", 30],
    ["study", "🎓", "資格の過去問を5問解く", 20],
    ["study", "📝", "明日やることを3つ書き出す", 10],
    ["study", "🧠", "気になる言葉を3つ調べてみる", 15],
    ["study", "🗂️", "PCのデスクトップを整理する", 20],
    ["relax", "🛁", "いつもより長めにお風呂に入る", 40],
    ["relax", "😴", "アラームをかけて20分昼寝する", 20],
    ["relax", "🍵", "温かい飲み物をゆっくり飲む", 10],
    ["relax", "📵", "30分スマホを置いて過ごす", 30],
    ["relax", "🕯️", "目を閉じて深呼吸を5回する", 5],
    ["relax", "🎶", "好きな曲だけでプレイリストを作る", 30],
    ["move", "🤸", "ストレッチを10分する", 10],
    ["move", "🏃", "軽くジョギングを20分する", 20],
    ["move", "💪", "スクワットを20回やってみる", 5],
    ["move", "🕺", "好きな曲1曲ぶん踊る", 5],
    ["move", "🧘", "YouTubeでヨガ動画を1本やる", 20],
    ["move", "🏀", "友だちを誘って体を動かす", 90],
  ] as const
).map(([g, icon, title, min]) => ({ g, icon, title, min }));

export const QUESTIONS = [
  "今日やることを自分で決められましたか？",
  "決めたことを実際にやりましたか？",
  "今日の時間の使い方に満足していますか？",
];

export const REVIEW_COMMENTS = [
  "今日はゆっくりな日だったね。明日はガチャを1回まわすところから始めてみよう。",
  "1つでも「はい」があればOK！小さな一歩が積み重なります。",
  "いい感じ！あと少しで満点の1日です。",
  "完ぺき！自分で決めて、行動して、満足できた最高の1日でした。",
];

// 記録画面のサンプル（6日前〜昨日）
export const SAMPLE_SCORES = [2, 0, 3, 1, 2, 3];
export const SAMPLE_LOG: LogEntry[] = [
  { icon: "🚶", title: "近所を知らない道で15分散歩する", when: "昨日", src: "ガチャ", done: true },
  { icon: "🔤", title: "英単語を10個だけ覚える", when: "昨日", src: "提案", done: true },
  { icon: "🎬", title: "前から観たかった映画を1本観る", when: "2日前", src: "ガチャ", done: false },
  { icon: "🤸", title: "ストレッチを10分する", when: "3日前", src: "提案", done: true },
];

export const GACHA_PER_DAY = 3;

export const WEEKDAYS = "日月火水木金土";

export const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];

export const minText = (m: number) => (m >= 60 ? `約${m / 60}時間` : `約${m}分`);
