import { useCallback, useEffect, useState } from "react";
import {
  translateHindiToAll,
  translateTribalToHindi,
  detectInputLanguage,
  toOlChiki,
  EXTENDED_PHRASES,
  VOCABULARY,
  type TranslationMultiOutput,
  type TribalToHindiOutput,
} from "./translation-engine";

export {
  translateHindiToAll,
  translateTribalToHindi,
  detectInputLanguage,
  toOlChiki,
  EXTENDED_PHRASES,
  VOCABULARY,
  type TranslationMultiOutput,
  type TribalToHindiOutput,
};

export type LangCode = "ho" | "mundari" | "santhali";

export type Language = {
  code: LangCode;
  name: string;
  native: string;
  speakers: string;
  pack: string;
};

export const LANGUAGES: Language[] = [
  { code: "ho", name: "Ho", native: "हो", speakers: "12,400 students", pack: "42 MB" },
  {
    code: "mundari",
    name: "Mundari",
    native: "मुंडारी",
    speakers: "8,900 students",
    pack: "48 MB",
  },
  {
    code: "santhali",
    name: "Santhali",
    native: "ᱥᱟᱱᱛᱟᱲᱤ",
    speakers: "6,100 students",
    pack: "51 MB",
  },
];

export function getLanguage(code: LangCode): Language {
  return LANGUAGES.find((l) => l.code === code) ?? (LANGUAGES[0] as Language);
}

const STORAGE_KEY = "bhashamitra.language";

/** Selected target language, remembered on the device (offline friendly). */
export function useLanguage() {
  const [code, setCode] = useState<LangCode>("ho");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) setCode(saved);
    setHydrated(true);
  }, []);

  const select = useCallback((next: LangCode) => {
    setCode(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { code, language: getLanguage(code), select, hydrated };
}

/* ------------------------------------------------------------------ *
 * Offline demo phrase engine.
 * A small on-device lexicon of Hindi FLN vocabulary mapped to each
 * tribal language, plus a phrase table for full classroom sentences.
 * ------------------------------------------------------------------ */

type Triple = Record<LangCode, string>;

const PHRASES: Array<{ hi: string; out: Triple }> = [
  {
    hi: "एक से दस तक गिनो।",
    out: {
      ho: "Miyad ete gel jaked lekha me.",
      mundari: "Miad ete gel habic lekha me.",
      santhali: "Mit' khon gel dhabic' lekha me.",
    },
  },
  {
    hi: "बच्चों, आज हम तीन और दो का जोड़ सीखेंगे।",
    out: {
      ho: "Hon ko, tising ale api ar baria mesa ituna.",
      mundari: "Hon ko, tisin abu api ar baria mesa itun-a.",
      santhali: "Gidra ko, tehen abo pe ar bar mesa cetan-a.",
    },
  },
  {
    hi: "अपना नाम बताओ।",
    out: {
      ho: "Ama nutum kaji me.",
      mundari: "Am nutum kaji me.",
      santhali: "Amak' nutum lai me.",
    },
  },
  {
    hi: "सुबह में हम पानी पीते हैं।",
    out: {
      ho: "Setak re ale da nu tana.",
      mundari: "Setak re abu da nu tana.",
      santhali: "Setak re abo dak' nu kana.",
    },
  },
  {
    hi: "कल तुमने क्या खाना खाया था?",
    out: {
      ho: "Hola am cikana jom keda?",
      mundari: "Hola am cinaa jom keda?",
      santhali: "Hola am cet' jom ked'a?",
    },
  },
  {
    hi: "किताब खोलो और पढ़ो।",
    out: {
      ho: "Puthi nij me ar padao me.",
      mundari: "Puthi nij me ar paro me.",
      santhali: "Puthi jharao me ar paro me.",
    },
  },
];

const LEXICON: Array<{ hi: string; out: Triple }> = [
  { hi: "बच्चों", out: { ho: "hon ko", mundari: "hon ko", santhali: "gidra ko" } },
  { hi: "बच्चे", out: { ho: "hon ko", mundari: "hon ko", santhali: "gidra ko" } },
  { hi: "पानी", out: { ho: "da", mundari: "da", santhali: "dak'" } },
  { hi: "घर", out: { ho: "oa", mundari: "oah", santhali: "orak'" } },
  { hi: "माँ", out: { ho: "enga", mundari: "enga", santhali: "ayo" } },
  { hi: "पिता", out: { ho: "apu", mundari: "apu", santhali: "baba" } },
  { hi: "सूरज", out: { ho: "singi", mundari: "singi", santhali: "singi" } },
  { hi: "पेड़", out: { ho: "daru", mundari: "daru", santhali: "dare" } },
  { hi: "फूल", out: { ho: "baa", mundari: "baa", santhali: "baha" } },
  { hi: "किताब", out: { ho: "puthi", mundari: "puthi", santhali: "puthi" } },
  { hi: "आम", out: { ho: "uli", mundari: "uli", santhali: "ul" } },
  { hi: "गाय", out: { ho: "uri", mundari: "uri", santhali: "gai" } },
  { hi: "एक", out: { ho: "miyad", mundari: "miad", santhali: "mit'" } },
  { hi: "दो", out: { ho: "baria", mundari: "baria", santhali: "bar" } },
  { hi: "तीन", out: { ho: "apia", mundari: "api", santhali: "pe" } },
  { hi: "चार", out: { ho: "upunia", mundari: "upun", santhali: "pon" } },
  { hi: "पाँच", out: { ho: "moya", mundari: "monea", santhali: "more" } },
  { hi: "दस", out: { ho: "gel", mundari: "gel", santhali: "gel" } },
  { hi: "पढ़ो", out: { ho: "padao me", mundari: "paro me", santhali: "paro me" } },
  { hi: "लिखो", out: { ho: "ol me", mundari: "ol me", santhali: "ol me" } },
  { hi: "सुनो", out: { ho: "ayum me", mundari: "ayum me", santhali: "anjom me" } },
  { hi: "बोलो", out: { ho: "kaji me", mundari: "kaji me", santhali: "ror me" } },
  { hi: "गिनो", out: { ho: "lekha me", mundari: "lekha me", santhali: "lekha me" } },
  { hi: "आज", out: { ho: "tising", mundari: "tisin", santhali: "tehen" } },
  { hi: "अच्छा", out: { ho: "bugin", mundari: "bugin", santhali: "bes" } },
  { hi: "नाम", out: { ho: "nutum", mundari: "nutum", santhali: "nutum" } },
  { hi: "स्कूल", out: { ho: "iskul", mundari: "iskul", santhali: "iskul" } },
  { hi: "खाना", out: { ho: "jom", mundari: "jom", santhali: "jom" } },
];

/** Offline translation engine: phrase match, then word-by-word with morphological rules. */
export function translateToTribal(hindi: string, code: LangCode): string {
  const text = hindi.trim();
  if (!text) return "";

  const multi = translateHindiToAll(text);
  if (code === "santhali") return multi.santali.latin;
  if (code === "ho") return multi.ho.latin;
  if (code === "mundari") return multi.mundari.latin;
  return "";
}

export const SAMPLE_LESSONS = [
  {
    id: "numbers",
    title: "Lesson 4 · Numbers 1–10",
    outcome: "NIPUN · Number sense",
    hindi: "एक से दस तक गिनो।",
  },
  {
    id: "addition",
    title: "Lesson 7 · Simple addition",
    outcome: "NIPUN · Number sense",
    hindi: "बच्चों, आज हम तीन और दो का जोड़ सीखेंगे।",
  },
  {
    id: "hygiene",
    title: "Lesson 2 · Morning habits",
    outcome: "NIPUN · Oral language",
    hindi: "सुबह में हम पानी पीते हैं।",
  },
  {
    id: "reading",
    title: "Lesson 9 · Reading aloud",
    outcome: "NIPUN · Reading with comprehension",
    hindi: "किताब खोलो और पढ़ो।",
  },
];

export const CLASSROOM_PROMPTS = [
  "अपना नाम बताओ।",
  "कल तुमने क्या खाना खाया था?",
  "सुबह में हम पानी पीते हैं।",
  "किताब खोलो और पढ़ो।",
];

export type Outcome = {
  id: string;
  label: string;
  hindiTopic: string;
  items: Array<{ hi: string; emoji: string }>;
};

export const OUTCOMES: Outcome[] = [
  {
    id: "phonics",
    label: "Phonics & letters",
    hindiTopic: "अक्षर पहचान",
    items: [
      { hi: "आम", emoji: "🥭" },
      { hi: "घर", emoji: "🏠" },
      { hi: "फूल", emoji: "🌼" },
      { hi: "गाय", emoji: "🐄" },
    ],
  },
  {
    id: "numbers",
    label: "Number sense",
    hindiTopic: "गिनती",
    items: [
      { hi: "एक", emoji: "1️⃣" },
      { hi: "दो", emoji: "2️⃣" },
      { hi: "तीन", emoji: "3️⃣" },
      { hi: "दस", emoji: "🔟" },
    ],
  },
  {
    id: "world",
    label: "My world",
    hindiTopic: "मेरा परिवेश",
    items: [
      { hi: "पानी", emoji: "💧" },
      { hi: "पेड़", emoji: "🌳" },
      { hi: "सूरज", emoji: "☀️" },
      { hi: "माँ", emoji: "👩" },
    ],
  },
  {
    id: "colors",
    label: "Colors around us",
    hindiTopic: "रंग पहचान",
    items: [
      { hi: "लाल", emoji: "🔴" },
      { hi: "पीला", emoji: "🟡" },
      { hi: "हरा", emoji: "🟢" },
      { hi: "नीला", emoji: "🔵" },
    ],
  },
  {
    id: "animals",
    label: "Animals & sounds",
    hindiTopic: "जानवर पहचान",
    items: [
      { hi: "कुत्ता", emoji: "🐕" },
      { hi: "बिल्ली", emoji: "🐈" },
      { hi: "मछली", emoji: "🐟" },
      { hi: "चिड़िया", emoji: "🐦" },
    ],
  },
  {
    id: "family",
    label: "My family",
    hindiTopic: "परिवार के लोग",
    items: [
      { hi: "पिता", emoji: "👨" },
      { hi: "भाई", emoji: "👦" },
      { hi: "बहन", emoji: "👧" },
      { hi: "दादी", emoji: "👵" },
    ],
  },
  {
    id: "classroom",
    label: "My classroom",
    hindiTopic: "कक्षा की चीज़ें",
    items: [
      { hi: "किताब", emoji: "📖" },
      { hi: "कलम", emoji: "🖊️" },
      { hi: "कुर्सी", emoji: "🪑" },
      { hi: "बस्ता", emoji: "🎒" },
    ],
  },
];
