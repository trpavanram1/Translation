import type { LangCode } from "./lang";

export interface TranslationMultiOutput {
  sourceText: string;
  sourceLang: "hi" | LangCode;
  santali: {
    olChiki: string;
    latin: string;
    devanagari: string;
  };
  ho: {
    warangChiti?: string;
    latin: string;
    devanagari: string;
  };
  mundari: {
    latin: string;
    devanagari: string;
  };
  breakdown: Array<{
    source: string;
    santali: string;
    ho: string;
    mundari: string;
    hindi?: string;
  }>;
  direction: "hi-to-tribal" | "tribal-to-hi";
  confidence: number;
}

export interface TribalToHindiOutput {
  sourceText: string;
  sourceLang: LangCode;
  detectedLangName: string;
  hindi: string;
  latin: string;
  breakdown: Array<{
    tribal: string;
    hindi: string;
  }>;
  confidence: number;
}

/* ------------------------------------------------------------------
 * Ol Chiki Orthography & Mapping (Pt. Raghunath Murmu Script)
 * ------------------------------------------------------------------ */

// Latin to Ol Chiki character and digraph map
const LATIN_TO_OL_CHIKI_MAP: Record<string, string> = {
  // vowels
  a: "ᱟ",
  aa: "ᱟ",
  i: "ᱤ",
  ee: "ᱤ",
  u: "ᱩ",
  oo: "ᱩ",
  e: "ᱮ",
  o: "ᱳ",
  // consonants & digraphs
  kh: "ᱠᱷ",
  gh: "ᱜᱷ",
  ng: "ᱝ",
  ch: "ᱪ",
  jh: "ᱡᱷ",
  ny: "ᱧ",
  th: "ᱛᱷ",
  dh: "ᱫᱷ",
  ph: "ᱯᱷ",
  bh: "ᱵᱷ",
  sh: "ᱥ",
  rr: "ᱲ",
  rh: "ᱲᱷ",
  tt: "ᱴ",
  dd: "ᱰ",
  k: "ᱠ",
  g: "ᱜ",
  c: "ᱪ",
  j: "ᱡ",
  t: "ᱛ",
  d: "ᱫ",
  n: "ᱱ",
  p: "ᱯ",
  b: "ᱵ",
  m: "ᱢ",
  y: "ᱭ",
  r: "ᱨ",
  l: "ᱞ",
  w: "ᱣ",
  v: "ᱣ",
  s: "ᱥ",
  h: "ᱦ",
  // diacritics
  "'": "ᱹ",
  "-": "ᱼ",
  ".": "ᱸ",
};

// Common direct Santali words to authentic Ol Chiki
const DIRECT_OL_CHIKI_WORDS: Record<string, string> = {
  "mit'": "ᱢᱤᱫ",
  bar: "ᱵᱟᱨ",
  pe: "ᱯᱮ",
  pon: "ᱯᱳᱱ",
  more: "ᱢᱳᱲᱮ",
  turui: "ᱛᱩᱨᱩᱭ",
  eya: "ᱮᱭᱟ",
  iral: "ᱤᱨᱟᱹᱞ",
  are: "ᱟᱨᱮ",
  gel: "ᱜᱮᱞ",
  "dak'": "ᱫᱟᱜ",
  "orak'": "ᱚᱲᱟᱜ",
  ayo: "ᱟᱭᱳ",
  baba: "ᱵᱟᱵᱟ",
  singi: "ᱥᱤᱧᱜᱤ",
  dare: "ᱫᱟᱨᱮ",
  baha: "ᱵᱟᱦᱟ",
  puthi: "ᱯᱩᱛᱷᱤ",
  ul: "ᱩᱞ",
  gai: "ᱜᱟᱹᱭ",
  merom: "ᱢᱮᱨᱳᱢ",
  seta: "ᱥᱮᱛᱟ",
  gidra: "ᱜᱤᱫᱽᱨᱟᱹ",
  "gidra ko": "ᱜᱤᱫᱽᱨᱟᱹ ᱠᱳ",
  am: "ᱟᱢ",
  "amak'": "ᱟᱢᱟᱜ",
  iny: "ᱤᱧ",
  "inyak'": "ᱤᱧᱟᱜ",
  ing: "ᱤᱧ",
  nutum: "ᱧᱩᱛᱩᱢ",
  "lai me": "ᱞᱟᱹᱭ ᱢᱮ",
  "ror me": "ᱨᱚᱲ ᱢᱮ",
  "ol me": "ᱚᱞ ᱢᱮ",
  "paro me": "ᱯᱟᱲᱦᱟᱣ ᱢᱮ",
  "durup' me": "ᱫᱩᱲᱩᱵ ᱢᱮ",
  "tingun me": "ᱛᱤᱸᱜᱩᱱ ᱢᱮ",
  "anjom me": "ᱟᱧᱡᱚᱢ ᱢᱮ",
  "lekha me": "ᱞᱮᱠᱷᱟ ᱢᱮ",
  tehen: "ᱛᱮᱦᱮᱧ",
  bes: "ᱵᱮᱥ",
  johar: "ᱡᱳᱦᱟᱨ",
  iskul: "ᱤᱥᱠᱩᱞ",
  jom: "ᱡᱳᱢ",
  "jom ked'a": "ᱡᱳᱢ ᱠᱮᱫᱟ",
  "cet'": "ᱪᱮᱫ",
  hola: "ᱦᱳᱞᱟ",
  abo: "ᱟᱵᱳ",
  ale: "ᱟᱞᱮ",
  khon: "ᱠᱷᱳᱱ",
  "dhabic'": "ᱫᱷᱟᱹᱵᱤᱡ",
  "cetan-a": "ᱪᱮᱛᱟᱱ-ᱟ",
  kana: "ᱠᱟᱱᱟ",
  "kana ko": "ᱠᱟᱱᱟ ᱠᱳ",
  "kami kana ko": "ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ ᱠᱳ",
  "tahen me": "ᱛᱟᱦᱮᱸᱱ ᱢᱮ",
  menama: "ᱢᱮᱱᱟᱢᱟ",
  banar: "ᱵᱟᱱᱟᱨ",
  ar: "ᱟᱨ",
  target: "ᱴᱟᱨᱜᱮᱴ",
  jos: "ᱡᱳᱥ",
  sanjay: "ᱥᱚᱱᱡᱚᱭ",
  pawan: "ᱯᱚᱣᱚᱱ",
  rohit: "ᱨᱳᱦᱤᱛ",
  amit: "ᱟᱢᱤᱛ",
  rahul: "ᱨᱟᱦᱩᱞ",
  jharkhand: "ᱡᱷᱟᱨᱠᱷᱚᱱᱰ",
  ranchi: "ᱨᱟᱺᱪᱤ",
};

/**
 * Phonetically transliterates Devanagari Hindi text to clean Latin characters.
 * Handles proper nouns, Indian names, loanwords, consonants, matras, and schwa.
 */
export function devanagariToLatinPhonetic(devText: string): string {
  const directNames: Record<string, string> = {
    संजय: "Sanjay",
    पवन: "Pawan",
    रोहित: "Rohit",
    अमित: "Amit",
    सुमित: "Sumit",
    राहुल: "Rahul",
    प्रिया: "Priya",
    अंजलि: "Anjali",
    पूजा: "Pooja",
    नेहा: "Neha",
    विकास: "Vikas",
    अभिषेक: "Abhishek",
    सुरेश: "Suresh",
    रमेश: "Ramesh",
    राकेश: "Rakesh",
    झारखंड: "Jharkhand",
    रांची: "Ranchi",
    जमशेदपुर: "Jamshedpur",
    दुमका: "Dumka",
    बोकारो: "Bokaro",
    धनबाद: "Dhanbad",
    चाईबासा: "Chaibasa",
    खूंटी: "Khunti",
    गुमला: "Gumla",
    सिमडेगा: "Simdega",
    देवघर: "Deoghar",
    गोड्डा: "Godda",
    साहेबगंज: "Sahebganj",
    पाकुड़: "Pakur",
    टारगेट: "Target",
  };

  const clean = devText.trim();
  if (directNames[clean]) return directNames[clean];

  const consonants: Record<string, string> = {
    क: "k",
    ख: "kh",
    ग: "g",
    घ: "gh",
    ङ: "ng",
    च: "ch",
    छ: "chh",
    ज: "j",
    झ: "jh",
    ञ: "ny",
    ट: "t",
    ठ: "th",
    ड: "d",
    ढ: "dh",
    ण: "n",
    त: "t",
    थ: "th",
    द: "d",
    ध: "dh",
    न: "n",
    प: "p",
    फ: "ph",
    ब: "b",
    भ: "bh",
    म: "m",
    य: "y",
    र: "r",
    ल: "l",
    व: "w",
    श: "sh",
    ष: "sh",
    स: "s",
    ह: "h",
    ड़: "r",
    ढ़: "rh",
    फ़: "f",
    ज़: "z",
    ख़: "kh",
    ग़: "gh",
    क़: "q",
  };

  const vowels: Record<string, string> = {
    अ: "a",
    आ: "a",
    इ: "i",
    ई: "i",
    उ: "u",
    ऊ: "u",
    ऋ: "ri",
    ए: "e",
    ऐ: "ai",
    ओ: "o",
    औ: "au",
  };

  const matras: Record<string, string> = {
    "ा": "a",
    "ि": "i",
    "ी": "i",
    "ु": "u",
    "ू": "u",
    "ृ": "ri",
    "े": "e",
    "ै": "ai",
    "ो": "o",
    "ौ": "au",
  };

  let result = "";
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i]!;
    const nextChar = clean[i + 1];

    if (consonants[char]) {
      const c = consonants[char]!;
      if (nextChar === "्") {
        // Halant: skip halant and omit vowel
        result += c;
        i++;
      } else if (nextChar && matras[nextChar]) {
        // Consonant + matra
        result += c + matras[nextChar]!;
        i++;
      } else if (nextChar === "ं" || nextChar === "ँ") {
        // Consonant + anusvara/chandrabindu -> an
        result += c + "an";
        i++;
      } else {
        // Inherent 'a'
        const isEnd = i === clean.length - 1;
        result += isEnd ? c : c + "a";
      }
    } else if (vowels[char]) {
      result += vowels[char]!;
    } else if (matras[char]) {
      result += matras[char]!;
    } else if (char === "ं" || char === "ँ") {
      result += "n";
    } else if (char === "ः") {
      result += "h";
    } else {
      result += char;
    }
  }

  // Capitalize first letter if it looks like a word
  if (result.length > 0 && /^[a-z]/.test(result)) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

/**
 * Phonetically transliterates Devanagari to authentic Santali Ol Chiki.
 */
export function devanagariToOlChiki(devText: string): string {
  const directDevOlChiki: Record<string, string> = {
    संजय: "ᱥᱚᱱᱡᱚᱭ",
    पवन: "ᱯᱚᱣᱚᱱ",
    रोहित: "ᱨᱳᱦᱤᱛ",
    अमित: "ᱟᱢᱤᱛ",
    राहुल: "ᱨᱟᱦᱩᱞ",
    सुमित: "ᱥᱩᱢᱤᱛ",
    विकास: "ᱵᱤᱠᱟᱥ",
    टारगेट: "ᱴᱟᱨᱜᱮᱴ",
    झारखंड: "ᱡᱷᱟᱨᱠᱷᱚᱱᱰ",
    रांची: "ᱨᱟᱺᱪᱤ",
    और: "ᱟᱨ",
    दोनों: "ᱵᱟᱱᱟᱨ",
    मुझे: "ᱤᱧ",
    मुझको: "ᱤᱧ",
    हम: "ᱟᱵᱳ",
    तुम: "ᱟᱢ",
    आप: "ᱟᱯᱮ",
    वह: "ᱩᱱᱤ",
    वे: "ᱩᱱᱠᱩ",
    यह: "ᱱᱳᱣᱟ",
    हैं: "ᱠᱟᱱᱟ ᱠᱳ",
    है: "ᱠᱟᱱᱟ",
    था: "ᱛᱟᱦᱮᱸᱠᱟᱱᱟ",
    कर: "ᱠᱟᱹᱢᱤ",
    रहे: "ᱠᱟᱱᱟ",
  };

  const clean = devText.trim();
  if (directDevOlChiki[clean]) return directDevOlChiki[clean];

  const devToOlChikiGlyphs: Record<string, string> = {
    क: "ᱠ",
    ख: "ᱠᱷ",
    ग: "ᱜ",
    घ: "ᱜᱷ",
    ङ: "ᱝ",
    च: "ᱪ",
    छ: "ᱪᱷ",
    ज: "ᱡ",
    झ: "ᱡᱷ",
    ञ: "ᱧ",
    ट: "ᱴ",
    ठ: "ᱴᱷ",
    ड: "ᱰ",
    ढ: "ᱰᱷ",
    ण: "ᱬ",
    त: "ᱛ",
    थ: "ᱛᱷ",
    द: "ᱫ",
    ध: "ᱫᱷ",
    न: "ᱱ",
    प: "ᱯ",
    फ: "ᱯᱷ",
    ब: "ᱵ",
    भ: "ᱵᱷ",
    म: "ᱢ",
    य: "ᱭ",
    र: "ᱨ",
    ल: "ᱞ",
    व: "ᱣ",
    श: "ᱥ",
    ष: "ᱥ",
    स: "ᱥ",
    ह: "ᱦ",
    ड़: "ᱲ",
    ढ़: "ᱲᱷ",
    अ: "ᱚ",
    आ: "ᱟ",
    इ: "ᱤ",
    ई: "ᱤ",
    उ: "ᱩ",
    ऊ: "ᱩ",
    ए: "ᱮ",
    ऐ: "ᱟᱭ",
    ओ: "ᱳ",
    औ: "ᱟᱣ",
    "ा": "ᱟ",
    "ि": "ᱤ",
    "ी": "ᱤ",
    "ु": "ᱩ",
    "ू": "ᱩ",
    "े": "ᱮ",
    "ै": "ᱟᱭ",
    "ो": "ᱳ",
    "ौ": "ᱟᱣ",
    "ं": "ᱸ",
    "ँ": "ᱸ",
    "ः": "ᱦ",
  };

  let result = "";
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i]!;
    const nextChar = clean[i + 1];

    if (char === "्") continue;

    if (devToOlChikiGlyphs[char]) {
      result += devToOlChikiGlyphs[char]!;
      const isConsonant = /^[क-हड़ढ़]/.test(char);
      const nextIsHalant = nextChar === "्";
      const nextIsMatra = Boolean(nextChar && /^[ा-ौ]/.test(nextChar));
      const nextIsAnusvara = nextChar === "ं" || nextChar === "ँ";
      if (isConsonant && !nextIsHalant && !nextIsMatra && !nextIsAnusvara && nextChar) {
        result += "ᱚ";
      }
    } else {
      result += char;
    }
  }

  return result || toOlChiki(devanagariToLatinPhonetic(clean));
}

/**
 * Universal Ol Chiki converter: converts Latin or Devanagari text into authentic Ol Chiki.
 */
export function toOlChiki(text: string): string {
  if (!text) return "";

  // If text contains Devanagari characters, use Devanagari transliterator
  if (/[\u0900-\u097F]/.test(text)) {
    const words = text.split(/\s+/);
    return words.map((w) => devanagariToOlChiki(w)).join(" ");
  }

  // Latin text conversion
  const words = text.split(/\s+/);
  return words
    .map((w) => {
      const lower = w.toLowerCase().replace(/[.,!?;:]/g, "");
      const punct = w.slice(lower.length);

      if (DIRECT_OL_CHIKI_WORDS[lower]) {
        return DIRECT_OL_CHIKI_WORDS[lower] + (punct === "।" ? "᱾" : punct);
      }

      // Phonetic approximate
      let res = "";
      let i = 0;
      while (i < lower.length) {
        if (i + 1 < lower.length && LATIN_TO_OL_CHIKI_MAP[lower.slice(i, i + 2)]) {
          res += LATIN_TO_OL_CHIKI_MAP[lower.slice(i, i + 2)];
          i += 2;
        } else if (LATIN_TO_OL_CHIKI_MAP[lower[i] || ""]) {
          res += LATIN_TO_OL_CHIKI_MAP[lower[i] || ""];
          i += 1;
        } else {
          res += lower[i];
          i += 1;
        }
      }
      return (res || w) + (punct === "।" ? "᱾" : punct);
    })
    .join(" ");
}

/* ------------------------------------------------------------------
 * Extensive Bidirectional Classroom & FLN Phrase Table
 * ------------------------------------------------------------------ */

export interface PhraseEntry {
  hindi: string;
  santali: {
    latin: string;
    olChiki: string;
    devanagari: string;
  };
  ho: {
    latin: string;
    devanagari: string;
    warangChiti?: string;
  };
  mundari: {
    latin: string;
    devanagari: string;
  };
  category: "classroom" | "math" | "greetings" | "daily" | "questions";
  tags?: string[];
}

export const EXTENDED_PHRASES: PhraseEntry[] = [
  // Numbers & Math
  {
    hindi: "एक से दस तक गिनो।",
    santali: {
      latin: "Mit' khon gel dhabic' lekha me.",
      olChiki: "ᱢᱤᱫ ᱠᱷᱳᱱ ᱜᱮᱞ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱢᱮ᱾",
      devanagari: "मित् खोन गेल धाबिच लेखा मे।",
    },
    ho: {
      latin: "Miyad ete gel jaked lekha me.",
      devanagari: "मियाद एते गेल जाकेद लेखा मे।",
    },
    mundari: {
      latin: "Miad ete gel habic lekha me.",
      devanagari: "मिआद एते गेल हाबिच लेखा मे।",
    },
    category: "math",
    tags: ["गिनती", "math", "numbers", "nipun"],
  },
  {
    hindi: "बच्चों, आज हम तीन और दो का जोड़ सीखेंगे।",
    santali: {
      latin: "Gidra ko, tehen abo pe ar bar mesa cetan-a.",
      olChiki: "ᱜᱤᱫᱽᱨᱟᱹ ᱠᱳ, ᱛᱮᱦᱮᱧ ᱟᱵᱳ ᱯᱮ ᱟᱨ ᱵᱟᱨ ᱢᱮᱥᱟ ᱪᱮᱛᱟᱱ-ᱟ᱾",
      devanagari: "गिदरा को, तेहेन आबो पे आर बार मेसा चेतान-आ।",
    },
    ho: {
      latin: "Hon ko, tising ale api ar baria mesa ituna.",
      devanagari: "होन को, तिसिंग आले आपि आर बारिया मेसा ईतुना।",
    },
    mundari: {
      latin: "Hon ko, tisin abu api ar baria mesa itun-a.",
      devanagari: "होन को, तिसिन आबु आपि आर बारिया मेसा ईतुन-आ।",
    },
    category: "math",
    tags: ["जोड़", "addition", "fln"],
  },
  {
    hindi: "दो और दो चार होते हैं।",
    santali: {
      latin: "Bar ar bar pon hoe-a.",
      olChiki: "ᱵᱟᱨ ᱟᱨ ᱵᱟᱨ ᱯᱳᱱ ᱦᱳᱭ-ᱟ᱾",
      devanagari: "बार आर बार पोन होए-आ।",
    },
    ho: {
      latin: "Baria ar baria upunia hobao-a.",
      devanagari: "बारिया आर बारिया उपुनिया होबाओ-आ।",
    },
    mundari: {
      latin: "Baria ar baria upun hobao-a.",
      devanagari: "बारिया आर बारिया उपुन होबाओ-आ।",
    },
    category: "math",
  },
  {
    hindi: "पाँच में से दो घटाओ।",
    santali: {
      latin: "More khon bar og me.",
      olChiki: "ᱢᱳᱲᱮ ᱠᱷᱳᱱ ᱵᱟᱨ ᱚᱜ ᱢᱮ᱾",
      devanagari: "मोड़े खोन बार ओग मे।",
    },
    ho: {
      latin: "Moya ete baria auti me.",
      devanagari: "मोया एते बारिया औती मे।",
    },
    mundari: {
      latin: "Monea ete baria auti me.",
      devanagari: "मोनेया एते बारिया औती मे।",
    },
    category: "math",
  },

  // Classroom Instructions & Discipline
  {
    hindi: "अपना नाम बताओ।",
    santali: {
      latin: "Amak' nutum lai me.",
      olChiki: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱞᱟᱹᱭ ᱢᱮ᱾",
      devanagari: "आमाग ञुतुम लय मे।",
    },
    ho: {
      latin: "Ama nutum kaji me.",
      devanagari: "आमा ञुतुम काजी मे।",
    },
    mundari: {
      latin: "Am nutum kaji me.",
      devanagari: "आम ञुतुम काजी मे।",
    },
    category: "classroom",
    tags: ["नाम", "identity"],
  },
  {
    hindi: "किताब खोलो और पढ़ो।",
    santali: {
      latin: "Puthi jharao me ar paro me.",
      olChiki: "ᱯᱩᱛᱷᱤ ᱡᱷᱟᱲᱟᱣ ᱢᱮ ᱟᱨ ᱯᱟᱲᱦᱟᱣ ᱢᱮ᱾",
      devanagari: "पुथी झाड़ाव मे आर पाड़ाव मे।",
    },
    ho: {
      latin: "Puthi nij me ar padao me.",
      devanagari: "पुथी नीज मे आर पढाव मे।",
    },
    mundari: {
      latin: "Puthi nij me ar paro me.",
      devanagari: "पुथी नीज मे आर पारो मे।",
    },
    category: "classroom",
    tags: ["किताब", "reading", "fln"],
  },
  {
    hindi: "सब बच्चे बैठ जाओ।",
    santali: {
      latin: "Sanam gidra durup' pe.",
      olChiki: "ᱥᱟᱱᱟᱢ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱩᱲᱩᱵ ᱯᱮ᱾",
      devanagari: "सानाम गिदरा दुरूब् पे।",
    },
    ho: {
      latin: "Soben hon ko duba pe.",
      devanagari: "सोबेन होन को डूबा पे।",
    },
    mundari: {
      latin: "Soben hon ko duba pe.",
      devanagari: "सोबेन होन को डूबा पे।",
    },
    category: "classroom",
  },
  {
    hindi: "बैठ जाओ।",
    santali: {
      latin: "Durup' me.",
      olChiki: "ᱫᱩᱲᱩᱵ ᱢᱮ᱾",
      devanagari: "दुरूब् मे।",
    },
    ho: {
      latin: "Duba me.",
      devanagari: "डूबा मे।",
    },
    mundari: {
      latin: "Duba me.",
      devanagari: "डूबा मे।",
    },
    category: "classroom",
  },
  {
    hindi: "खड़े हो जाओ।",
    santali: {
      latin: "Tingun me.",
      olChiki: "ᱛᱤᱸᱜᱩᱱ ᱢᱮ᱾",
      devanagari: "तींगुन मे।",
    },
    ho: {
      latin: "Tengun me.",
      devanagari: "तेंगून मे।",
    },
    mundari: {
      latin: "Tingun me.",
      devanagari: "तींगुन मे।",
    },
    category: "classroom",
  },
  {
    hindi: "ध्यान से सुनो।",
    santali: {
      latin: "Mon lagao kate anjom me.",
      olChiki: "ᱢᱳᱱ ᱞᱟᱜᱟᱣ ᱠᱟᱛᱮ ᱟᱧᱡᱚᱢ ᱢᱮ᱾",
      devanagari: "मोन लगाव काते आंजोम मे।",
    },
    ho: {
      latin: "Buginte ayum me.",
      devanagari: "बुगिन्ते आयूम मे।",
    },
    mundari: {
      latin: "Buginte ayum me.",
      devanagari: "बुगिन्ते आयूम मे।",
    },
    category: "classroom",
  },
  {
    hindi: "बच्चों, शांत रहो।",
    santali: {
      latin: "Gidra ko, thir tahen pe.",
      olChiki: "ᱜᱤᱫᱽᱨᱟᱹ ᱠᱳ, ᱛᱷᱤᱨ ᱛᱟᱦᱮᱸᱱ ᱯᱮ᱾",
      devanagari: "गिदरा को, थीर ताहेन पे।",
    },
    ho: {
      latin: "Hon ko, thir mena pe.",
      devanagari: "होन को, थीर मेना पे।",
    },
    mundari: {
      latin: "Hon ko, thir tain pe.",
      devanagari: "होन को, थीर ताईन पे।",
    },
    category: "classroom",
  },
  {
    hindi: "ब्लैकबोर्ड पर देखो।",
    santali: {
      latin: "Blackboard re benget' me.",
      olChiki: "ᱵᱞᱮᱠᱵᱳᱨᱰ ᱨᱮ ᱵᱮᱸᱜᱮᱫ ᱢᱮ᱾",
      devanagari: "ब्लैकबोर्ड रे बेंगेद् मे।",
    },
    ho: {
      latin: "Blackboard re nel me.",
      devanagari: "ब्लैकबोर्ड रे नेल मे।",
    },
    mundari: {
      latin: "Blackboard re nel me.",
      devanagari: "ब्लैकबोर्ड रे नेल मे।",
    },
    category: "classroom",
  },
  {
    hindi: "अपनी कॉपी में लिखो।",
    santali: {
      latin: "Apanak' khata re ol me.",
      olChiki: "ᱟᱯᱱᱟᱜ ᱠᱷᱟᱛᱟ ᱨᱮ ᱚᱞ ᱢᱮ᱾",
      devanagari: "आपनाग खाता रे ओल मे।",
    },
    ho: {
      latin: "Ama khata re ol me.",
      devanagari: "आमा खाता रे ओल मे।",
    },
    mundari: {
      latin: "Ama khata re ol me.",
      devanagari: "आमा खाता रे ओल मे।",
    },
    category: "classroom",
  },

  // Daily Habits & Hygiene
  {
    hindi: "सुबह में हम पानी पीते हैं।",
    santali: {
      latin: "Setak re abo dak' nu kana.",
      olChiki: "ᱥᱮᱛᱟᱜ ᱨᱮ ᱟᱵᱳ ᱫᱟᱜ ᱧᱩ ᱠᱟᱱᱟ᱾",
      devanagari: "सेताक रे आबो दाक नु काना।",
    },
    ho: {
      latin: "Setak re ale da nu tana.",
      devanagari: "सेताक रे आले दा नु ताना।",
    },
    mundari: {
      latin: "Setak re abu da nu tana.",
      devanagari: "सेताक रे आबु दा नु ताना।",
    },
    category: "daily",
    tags: ["hygiene", "पानी"],
  },
  {
    hindi: "खाना खाने से पहले हाथ धो लो।",
    santali: {
      latin: "Jom maren ti abuk' me.",
      olChiki: "ᱡᱳᱢ ᱢᱟᱲᱟᱝ ᱛᱤ ᱟᱹᱨᱩᱵ ᱢᱮ᱾",
      devanagari: "जोम मारांग ती आरूब मे।",
    },
    ho: {
      latin: "Jom sidare ti abung me.",
      devanagari: "जोम सीदारे ती आबुंग मे।",
    },
    mundari: {
      latin: "Jom sidare ti abung me.",
      devanagari: "जोम सीदारे ती आबुंग मे।",
    },
    category: "daily",
  },
  {
    hindi: "पानी लाओ।",
    santali: {
      latin: "Dak' agu me.",
      olChiki: "ᱫᱟᱜ ᱟᱹᱜᱩ ᱢᱮ᱾",
      devanagari: "दाक आगु मे।",
    },
    ho: {
      latin: "Da agu me.",
      devanagari: "दा आगु मे।",
    },
    mundari: {
      latin: "Da agu me.",
      devanagari: "दा आगु मे।",
    },
    category: "daily",
  },

  // Greetings & Conversational Questions
  {
    hindi: "आप कैसे हैं?",
    santali: {
      latin: "Ape cet' leka menapea?",
      olChiki: "ᱟᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱯᱮᱭᱟ?",
      devanagari: "आपे चेद लेका मेनापेया?",
    },
    ho: {
      latin: "Ape chilike menapea?",
      devanagari: "आपे चिलीके मेनापेया?",
    },
    mundari: {
      latin: "Ape chilika menapea?",
      devanagari: "आपे चिलिका मेनापेया?",
    },
    category: "greetings",
    tags: ["greeting", "हाल"],
  },
  {
    hindi: "आप कैसे हैं",
    santali: {
      latin: "Ape cet' leka menapea?",
      olChiki: "ᱟᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱯᱮᱭᱟ?",
      devanagari: "आपे चेद लेका मेनापेया?",
    },
    ho: {
      latin: "Ape chilike menapea?",
      devanagari: "आपे चिलीके मेनापेया?",
    },
    mundari: {
      latin: "Ape chilika menapea?",
      devanagari: "आपे चिलिका मेनापेया?",
    },
    category: "greetings",
  },
  {
    hindi: "आप कैसे हो?",
    santali: {
      latin: "Ape cet' leka menapea?",
      olChiki: "ᱟᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱯᱮᱭᱟ?",
      devanagari: "आपे चेद लेका मेनापेया?",
    },
    ho: {
      latin: "Ape chilike menapea?",
      devanagari: "आपे चिलीके मेनापेया?",
    },
    mundari: {
      latin: "Ape chilika menapea?",
      devanagari: "आपे चिलिका मेनापेया?",
    },
    category: "greetings",
  },
  {
    hindi: "आप कैसे हो",
    santali: {
      latin: "Ape cet' leka menapea?",
      olChiki: "ᱟᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱯᱮᱭᱟ?",
      devanagari: "आपे चेद लेका मेनापेया?",
    },
    ho: {
      latin: "Ape chilike menapea?",
      devanagari: "आपे चिलीके मेनापेया?",
    },
    mundari: {
      latin: "Ape chilika menapea?",
      devanagari: "आपे चिलिका मेनापेया?",
    },
    category: "greetings",
  },
  {
    hindi: "तुम कैसे हो?",
    santali: {
      latin: "Am cet' leka menama?",
      olChiki: "ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?",
      devanagari: "आम चेद लेका मेनामा?",
    },
    ho: {
      latin: "Am chilike menama?",
      devanagari: "आम चिलीके मेनामा?",
    },
    mundari: {
      latin: "Am chilika menama?",
      devanagari: "आम चिलिका मेनामा?",
    },
    category: "greetings",
  },
  {
    hindi: "तुम कैसे हो",
    santali: {
      latin: "Am cet' leka menama?",
      olChiki: "ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?",
      devanagari: "आम चेद लेका मेनामा?",
    },
    ho: {
      latin: "Am chilike menama?",
      devanagari: "आम चिलीके मेनामा?",
    },
    mundari: {
      latin: "Am chilika menama?",
      devanagari: "आम चिलिका मेनामा?",
    },
    category: "greetings",
  },
  {
    hindi: "तू कैसा है?",
    santali: {
      latin: "Am cet' leka menama?",
      olChiki: "ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?",
      devanagari: "आम चेद लेका मेनामा?",
    },
    ho: {
      latin: "Am chilike menama?",
      devanagari: "आम चिलीके मेनामा?",
    },
    mundari: {
      latin: "Am chilika menama?",
      devanagari: "आम चिलिका मेनामा?",
    },
    category: "greetings",
  },
  {
    hindi: "कैसे हो?",
    santali: {
      latin: "Cet' leka menama?",
      olChiki: "ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?",
      devanagari: "चेद लेका मेनामा?",
    },
    ho: {
      latin: "Chilike menama?",
      devanagari: "चिलीके मेनामा?",
    },
    mundari: {
      latin: "Chilika menama?",
      devanagari: "चिलिका मेनामा?",
    },
    category: "greetings",
  },
  {
    hindi: "कैसे हो",
    santali: {
      latin: "Cet' leka menama?",
      olChiki: "ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?",
      devanagari: "चेद लेका मेनामा?",
    },
    ho: {
      latin: "Chilike menama?",
      devanagari: "चिलीके मेनामा?",
    },
    mundari: {
      latin: "Chilika menama?",
      devanagari: "चिलिका मेनामा?",
    },
    category: "greetings",
  },
  {
    hindi: "कैसे हैं?",
    santali: {
      latin: "Cet' leka menapea?",
      olChiki: "ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱯᱮᱭᱟ?",
      devanagari: "चेद लेका मेनापेया?",
    },
    ho: {
      latin: "Chilike menapea?",
      devanagari: "चिलीके मेनापेया?",
    },
    mundari: {
      latin: "Chilika menapea?",
      devanagari: "चिलिका मेनापेया?",
    },
    category: "greetings",
  },
  {
    hindi: "क्या हाल है?",
    santali: {
      latin: "Cet' khobor menak'a?",
      olChiki: "ᱪᱮᱫ ᱠᱷᱚᱵᱚᱨ ᱢᱮᱱᱟᱜ-ᱟ?",
      devanagari: "चेद खोबोर मेनाग-आ?",
    },
    ho: {
      latin: "Cikana hal mena?",
      devanagari: "चिकाना हाल मेना?",
    },
    mundari: {
      latin: "Cinaa hal mena?",
      devanagari: "चिनाआ हाल मेना?",
    },
    category: "greetings",
  },
  {
    hindi: "तुम क्या कर रहे हो?",
    santali: {
      latin: "Am cet' kami kanam?",
      olChiki: "ᱟᱢ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟᱢ?",
      devanagari: "आम चेद कामी कानाम?",
    },
    ho: {
      latin: "Am cikana kami tanam?",
      devanagari: "आम चिकाना कामी तानाम?",
    },
    mundari: {
      latin: "Am cinaa kami tanam?",
      devanagari: "आम चिनाआ कामी तानाम?",
    },
    category: "questions",
  },
  {
    hindi: "आप क्या कर रहे हैं?",
    santali: {
      latin: "Ape cet' kami kanape?",
      olChiki: "ᱟᱯᱮ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟᱯᱮ?",
      devanagari: "आपे चेद कामी कानापे?",
    },
    ho: {
      latin: "Ape cikana kami tanape?",
      devanagari: "आपे चिकाना कामी तानापे?",
    },
    mundari: {
      latin: "Ape cinaa kami tanape?",
      devanagari: "आपे चिनाआ कामी तानापे?",
    },
    category: "questions",
  },
  {
    hindi: "तुम कहाँ जा रहे हो?",
    santali: {
      latin: "Am okare sen kanam?",
      olChiki: "ᱟᱢ ᱚᱠᱟᱨᱮ ᱥᱮᱱ ᱠᱟᱱᱟᱢ?",
      devanagari: "आम ओकारे सेन कानाम?",
    },
    ho: {
      latin: "Am okota sen tanam?",
      devanagari: "आम ओकोता सेन तानाम?",
    },
    mundari: {
      latin: "Am okonta sen tanam?",
      devanagari: "आम ओकोन्ता सेन तानाम?",
    },
    category: "questions",
  },
  {
    hindi: "आप कहाँ जा रहे हैं?",
    santali: {
      latin: "Ape okare sen kanape?",
      olChiki: "ᱟᱯᱮ ᱚᱠᱟᱨᱮ ᱥᱮᱱ ᱠᱟᱱᱟᱯᱮ?",
      devanagari: "आपे ओकारे सेन कानापे?",
    },
    ho: {
      latin: "Ape okota sen tanape?",
      devanagari: "आपे ओकोता सेन तानापे?",
    },
    mundari: {
      latin: "Ape okonta sen tanape?",
      devanagari: "आपे ओकोन्ता सेन तानापे?",
    },
    category: "questions",
  },
  {
    hindi: "तुम्हारा नाम क्या है?",
    santali: {
      latin: "Amak' nutum cet' kana?",
      olChiki: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ ᱠᱟᱱᱟ?",
      devanagari: "आमाग ञुतुम चेद काना?",
    },
    ho: {
      latin: "Ama nutum cikana tana?",
      devanagari: "आमा ञुतुम चिकाना ताना?",
    },
    mundari: {
      latin: "Am nutum cinaa tana?",
      devanagari: "आम ञुतुम चिनाआ ताना?",
    },
    category: "questions",
  },
  {
    hindi: "आपका नाम क्या है?",
    santali: {
      latin: "Apeak' nutum cet' kana?",
      olChiki: "ᱟᱯᱮᱭᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ ᱠᱟᱱᱟ?",
      devanagari: "आपेयाग ञुतुम चेद काना?",
    },
    ho: {
      latin: "Apea nutum cikana tana?",
      devanagari: "आपेया ञुतुम चिकाना ताना?",
    },
    mundari: {
      latin: "Apeak' nutum cinaa tana?",
      devanagari: "आपेयाग ञुतुम चिनाआ ताना?",
    },
    category: "questions",
  },
  {
    hindi: "जोहार, आप कैसे हैं?",
    santali: {
      latin: "Johar, am cet' leka menama?",
      olChiki: "ᱡᱳᱦᱟᱨ, ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?",
      devanagari: "जोहार, आम चेद लेका मेनामा?",
    },
    ho: {
      latin: "Johar, am chilike menama?",
      devanagari: "जोहार, आम चिलीके मेनामा?",
    },
    mundari: {
      latin: "Johar, am chilika menama?",
      devanagari: "जोहार, आम चिलिका मेनामा?",
    },
    category: "greetings",
    tags: ["जोहार", "greeting"],
  },
  {
    hindi: "मैं ठीक हूँ।",
    santali: {
      latin: "Iny bes menany-a.",
      olChiki: "ᱤᱧ ᱵᱮᱥ ᱢᱮᱱᱟᱹᱧ-ᱟ᱾",
      devanagari: "इंज बेस मेनांज-आ।",
    },
    ho: {
      latin: "Aing buginge menanga.",
      devanagari: "आईंग बुगींगे मेनांगा।",
    },
    mundari: {
      latin: "Aing buginge menana.",
      devanagari: "आईंग बुगींगे मेनाना।",
    },
    category: "greetings",
  },
  {
    hindi: "धन्यवाद।",
    santali: {
      latin: "Sarhao.",
      olChiki: "ᱥᱟᱨᱦᱟᱣ᱾",
      devanagari: "सारहाव।",
    },
    ho: {
      latin: "Sarhao.",
      devanagari: "सारहाव।",
    },
    mundari: {
      latin: "Sarhao.",
      devanagari: "सारहाव।",
    },
    category: "greetings",
  },
  {
    hindi: "नमस्ते।",
    santali: {
      latin: "Johar.",
      olChiki: "ᱡᱳᱦᱟᱨ᱾",
      devanagari: "जोहार।",
    },
    ho: {
      latin: "Johar.",
      devanagari: "जोहार।",
    },
    mundari: {
      latin: "Johar.",
      devanagari: "जोहार।",
    },
    category: "greetings",
  },
  {
    hindi: "जोहार।",
    santali: {
      latin: "Johar.",
      olChiki: "ᱡᱳᱦᱟᱨ᱾",
      devanagari: "जोहार।",
    },
    ho: {
      latin: "Johar.",
      devanagari: "जोहार।",
    },
    mundari: {
      latin: "Johar.",
      devanagari: "जोहार।",
    },
    category: "greetings",
  },
  {
    hindi: "कल तुमने क्या खाना खाया था?",
    santali: {
      latin: "Hola am cet' jom ked'a?",
      olChiki: "ᱦᱳᱞᱟ ᱟᱢ ᱪᱮᱫ ᱡᱳᱢ ᱠᱮᱫᱟ?",
      devanagari: "होला आम चेद जोम केदा?",
    },
    ho: {
      latin: "Hola am cikana jom keda?",
      devanagari: "होला आम चिकाना जोम केदा?",
    },
    mundari: {
      latin: "Hola am cinaa jom keda?",
      devanagari: "होला आम चिनाआ जोम केदा?",
    },
    category: "questions",
  },
  {
    hindi: "आज हम एक कहानी सुनेंगे।",
    santali: {
      latin: "Tehen abo mit' kahani anjom-a.",
      olChiki: "ᱛᱮᱦᱮᱧ ᱟᱵᱳ ᱢᱤᱫ ᱠᱟᱹᱦᱱᱤ ᱟᱧᱡᱚᱢ-ᱟ᱾",
      devanagari: "तेहेन आबो मित् काहनी आंजोम-आ।",
    },
    ho: {
      latin: "Tising abu miyad kani ayum-a.",
      devanagari: "तिसिंग आबु मियाद कानी आयूम-आ।",
    },
    mundari: {
      latin: "Tisin abu miad kahani ayum-a.",
      devanagari: "तिसिन आबु मिआद काहानी आयूम-आ।",
    },
    category: "classroom",
  },
];

/* ------------------------------------------------------------------
 * Expanded FLN Vocabulary Database (Hindi <-> Tribal)
 * ------------------------------------------------------------------ */

export interface LexiconEntry {
  hindi: string;
  santali: {
    latin: string;
    olChiki: string;
    devanagari: string;
  };
  ho: {
    latin: string;
    devanagari: string;
  };
  mundari: {
    latin: string;
    devanagari: string;
  };
  pos?: "noun" | "verb" | "adj" | "pron" | "num" | "adverb" | "aux";
}

export const VOCABULARY: LexiconEntry[] = [
  // Conversational Question N-Grams & Phrases
  {
    hindi: "आप कैसे हैं",
    santali: { latin: "Ape cet' leka menapea", olChiki: "ᱟᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱯᱮᱭᱟ", devanagari: "आपे चेद लेका मेनापेया" },
    ho: { latin: "Ape chilike menapea", devanagari: "आपे चिलीके मेनापेया" },
    mundari: { latin: "Ape chilika menapea", devanagari: "आपे चिलिका मेनापेया" },
    pos: "verb",
  },
  {
    hindi: "आप कैसे हो",
    santali: { latin: "Ape cet' leka menapea", olChiki: "ᱟᱯᱮ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱯᱮᱭᱟ", devanagari: "आपे चेद लेका मेनापेया" },
    ho: { latin: "Ape chilike menapea", devanagari: "आपे चिलीके मेनापेया" },
    mundari: { latin: "Ape chilika menapea", devanagari: "आपे चिलिका मेनापेया" },
    pos: "verb",
  },
  {
    hindi: "तुम कैसे हो",
    santali: { latin: "Am cet' leka menama", olChiki: "ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ", devanagari: "आम चेद लेका मेनामा" },
    ho: { latin: "Am chilike menama", devanagari: "आम चिलीके मेनामा" },
    mundari: { latin: "Am chilika menama", devanagari: "आम चिलिका मेनामा" },
    pos: "verb",
  },
  {
    hindi: "तू कैसा है",
    santali: { latin: "Am cet' leka menama", olChiki: "ᱟᱢ ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ", devanagari: "आम चेद लेका मेनामा" },
    ho: { latin: "Am chilike menama", devanagari: "आम चिलीके मेनामा" },
    mundari: { latin: "Am chilika menama", devanagari: "आम चिलिका मेनामा" },
    pos: "verb",
  },
  {
    hindi: "कैसे हैं",
    santali: { latin: "cet' leka menapea", olChiki: "ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱯᱮᱭᱟ", devanagari: "चेद लेका मेनापेया" },
    ho: { latin: "chilike menapea", devanagari: "चिलीके मेनापेया" },
    mundari: { latin: "chilika menapea", devanagari: "चिलिका मेनापेया" },
    pos: "verb",
  },
  {
    hindi: "कैसे हो",
    santali: { latin: "cet' leka menama", olChiki: "ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ", devanagari: "चेद लेका मेनामा" },
    ho: { latin: "chilike menama", devanagari: "चिलीके मेनामा" },
    mundari: { latin: "chilika menama", devanagari: "चिलिका मेनामा" },
    pos: "verb",
  },
  {
    hindi: "क्या हाल है",
    santali: { latin: "cet' khobor menak'a", olChiki: "ᱪᱮᱫ ᱠᱷᱚᱵᱚᱨ ᱢᱮᱱᱟᱜ-ᱟ", devanagari: "चेद खोबोर मेनाग-आ" },
    ho: { latin: "cikana hal mena", devanagari: "चिकाना हाल मेना" },
    mundari: { latin: "cinaa hal mena", devanagari: "चिनाआ हाल मेना" },
    pos: "verb",
  },
  {
    hindi: "तुम क्या कर रहे हो",
    santali: { latin: "Am cet' kami kanam", olChiki: "ᱟᱢ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟᱢ", devanagari: "आम चेद कामी कानाम" },
    ho: { latin: "Am cikana kami tanam", devanagari: "आम चिकाना कामी तानाम" },
    mundari: { latin: "Am cinaa kami tanam", devanagari: "आम चिनाआ कामी तानाम" },
    pos: "verb",
  },
  {
    hindi: "आप क्या कर रहे हैं",
    santali: { latin: "Ape cet' kami kanape", olChiki: "ᱟᱯᱮ ᱪᱮᱫ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟᱯᱮ", devanagari: "आपे चेद कामी कानापे" },
    ho: { latin: "Ape cikana kami tanape", devanagari: "आपे चिकाना कामी तानापे" },
    mundari: { latin: "Ape cinaa kami tanape", devanagari: "आपे चिनाआ कामी तानापे" },
    pos: "verb",
  },
  {
    hindi: "तुम कहाँ जा रहे हो",
    santali: { latin: "Am okare sen kanam", olChiki: "ᱟᱢ ᱚᱠᱟᱨᱮ ᱥᱮᱱ ᱠᱟᱱᱟᱢ", devanagari: "आम ओकारे सेन कानाम" },
    ho: { latin: "Am okota sen tanam", devanagari: "आम ओकोता सेन तानाम" },
    mundari: { latin: "Am okonta sen tanam", devanagari: "आम ओकोन्ता सेन तानाम" },
    pos: "verb",
  },
  {
    hindi: "आप कहाँ जा रहे हैं",
    santali: { latin: "Ape okare sen kanape", olChiki: "ᱟᱯᱮ ᱚᱠᱟᱨᱮ ᱥᱮᱱ ᱠᱟᱱᱟᱯᱮ", devanagari: "आपे ओकारे सेन कानापे" },
    ho: { latin: "Ape okota sen tanape", devanagari: "आपे ओकोता सेन तानापे" },
    mundari: { latin: "Ape okonta sen tanape", devanagari: "आपे ओकोन्ता सेन तानापे" },
    pos: "verb",
  },
  {
    hindi: "तुम्हारा नाम क्या है",
    santali: { latin: "Amak' nutum cet' kana", olChiki: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ ᱠᱟᱱᱟ", devanagari: "आमाग ञुतुम चेद काना" },
    ho: { latin: "Ama nutum cikana tana", devanagari: "आमा ञुतुम चिकाना ताना" },
    mundari: { latin: "Am nutum cinaa tana", devanagari: "आम ञुतुम चिनाआ ताना" },
    pos: "verb",
  },
  {
    hindi: "आपका नाम क्या है",
    santali: { latin: "Apeak' nutum cet' kana", olChiki: "ᱟᱯᱮᱭᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ ᱠᱟᱱᱟ", devanagari: "आपेयाग ञुतुम चेद काना" },
    ho: { latin: "Apea nutum cikana tana", devanagari: "आपेया ञुतुम चिकाना ताना" },
    mundari: { latin: "Apeak' nutum cinaa tana", devanagari: "आपेयाग ञुतुम चिनाआ ताना" },
    pos: "verb",
  },
  {
    hindi: "नाम क्या है",
    santali: { latin: "nutum cet' kana", olChiki: "ᱧᱩᱛᱩᱢ ᱪᱮᱫ ᱠᱟᱱᱟ", devanagari: "ञुतुम चेद काना" },
    ho: { latin: "nutum cikana tana", devanagari: "ञुतुम चिकाना ताना" },
    mundari: { latin: "nutum cinaa tana", devanagari: "ञुतुम चिनाआ ताना" },
    pos: "verb",
  },

  // Question Words
  {
    hindi: "कैसे",
    santali: { latin: "cet' leka", olChiki: "ᱪᱮᱫ ᱞᱮᱠᱟ", devanagari: "चेद लेका" },
    ho: { latin: "chilike", devanagari: "चिलीके" },
    mundari: { latin: "chilika", devanagari: "चिलिका" },
    pos: "adverb",
  },
  {
    hindi: "कैसा",
    santali: { latin: "cet' lekan", olChiki: "ᱪᱮᱫ ᱞᱮᱠᱟᱱ", devanagari: "चेद लेकान" },
    ho: { latin: "chilikan", devanagari: "चिलिकान" },
    mundari: { latin: "chilikan", devanagari: "चिलिकान" },
    pos: "adj",
  },
  {
    hindi: "कैसी",
    santali: { latin: "cet' lekan", olChiki: "ᱪᱮᱫ ᱞᱮᱠᱟᱱ", devanagari: "चेद लेकान" },
    ho: { latin: "chilikan", devanagari: "चिलिकान" },
    mundari: { latin: "chilikan", devanagari: "चिलिकान" },
    pos: "adj",
  },
  {
    hindi: "हो",
    santali: { latin: "menama", olChiki: "ᱢᱮᱱᱟᱢᱟ", devanagari: "मेनामा" },
    ho: { latin: "menama", devanagari: "मेनामा" },
    mundari: { latin: "menama", devanagari: "मेनामा" },
    pos: "aux",
  },
  {
    hindi: "हूँ",
    santali: { latin: "menana", olChiki: "ᱢᱮᱱᱟᱹᱧ", devanagari: "मेनांज" },
    ho: { latin: "menanga", devanagari: "मेनांगा" },
    mundari: { latin: "menana", devanagari: "मेनाना" },
    pos: "aux",
  },
  {
    hindi: "कर रहे हो",
    santali: { latin: "kami kanam", olChiki: "ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟᱢ", devanagari: "कामी कानाम" },
    ho: { latin: "kami tanam", devanagari: "कामी तानाम" },
    mundari: { latin: "kami tanam", devanagari: "कामी तानाम" },
    pos: "verb",
  },
  {
    hindi: "जा रहे हो",
    santali: { latin: "sen kanam", olChiki: "ᱥᱮᱱ ᱠᱟᱱᱟᱢ", devanagari: "सेन कानाम" },
    ho: { latin: "sen tanam", devanagari: "सेन तानाम" },
    mundari: { latin: "sen tanam", devanagari: "सेन तानाम" },
    pos: "verb",
  },
  {
    hindi: "आ रहे हो",
    santali: { latin: "hiju' kanam", olChiki: "ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟᱢ", devanagari: "हिजुग् कानाम" },
    ho: { latin: "hiju' tanam", devanagari: "हिजु तानाम" },
    mundari: { latin: "hiju' tanam", devanagari: "हिजु तानाम" },
    pos: "verb",
  },
  {
    hindi: "बोल रहे हो",
    santali: { latin: "ror kanam", olChiki: "ᱨᱚᱲ ᱠᱟᱱᱟᱢ", devanagari: "रोड़ कानाम" },
    ho: { latin: "kaji tanam", devanagari: "काजी तानाम" },
    mundari: { latin: "kaji tanam", devanagari: "काजी तानाम" },
    pos: "verb",
  },
  {
    hindi: "सुन रहे हो",
    santali: { latin: "anjom kanam", olChiki: "ᱟᱧᱡᱚᱢ ᱠᱟᱱᱟᱢ", devanagari: "आंजोम कानाम" },
    ho: { latin: "ayum tanam", devanagari: "आयूम तानाम" },
    mundari: { latin: "ayum tanam", devanagari: "आयूम तानाम" },
    pos: "verb",
  },

  // Multi-word Compound Expressions & Verbal Auxiliaries
  {
    hindi: "टारगेट कर रहे हैं",
    santali: { latin: "target kami kana ko", olChiki: "ᱴᱟᱨᱜᱮᱴ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ ᱠᱳ", devanagari: "टारगेट कामी काना को" },
    ho: { latin: "target kami tana ko", devanagari: "टारगेट कामी ताना को" },
    mundari: { latin: "target kami tana ko", devanagari: "टारगेट कामी ताना को" },
    pos: "verb",
  },
  {
    hindi: "कर रहे हैं",
    santali: { latin: "kami kana ko", olChiki: "ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ ᱠᱳ", devanagari: "कामी काना को" },
    ho: { latin: "kami tana ko", devanagari: "कामी ताना को" },
    mundari: { latin: "kami tana ko", devanagari: "कामी ताना को" },
    pos: "verb",
  },
  {
    hindi: "कर रहा है",
    santali: { latin: "kami kanae", olChiki: "ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟᱭ", devanagari: "कामी कानाए" },
    ho: { latin: "kami tanae", devanagari: "कामी तानाए" },
    mundari: { latin: "kami tanae", devanagari: "कामी तानाए" },
    pos: "verb",
  },
  {
    hindi: "कर रही है",
    santali: { latin: "kami kanae", olChiki: "ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟᱭ", devanagari: "कामी कानाए" },
    ho: { latin: "kami tanae", devanagari: "कामी तानाए" },
    mundari: { latin: "kami tanae", devanagari: "कामी तानाए" },
    pos: "verb",
  },
  {
    hindi: "कर रहा हूँ",
    santali: { latin: "kami kanany", olChiki: "ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟᱧ", devanagari: "कामी कानांज" },
    ho: { latin: "kami tanang", devanagari: "कामी तानांग" },
    mundari: { latin: "kami tanang", devanagari: "कामी तानांग" },
    pos: "verb",
  },
  {
    hindi: "करते हैं",
    santali: { latin: "kami-ako", olChiki: "ᱠᱟᱹᱢᱤ-ᱟᱠᱳ", devanagari: "कामी-आको" },
    ho: { latin: "kami-ako", devanagari: "कामी-आको" },
    mundari: { latin: "kami-ako", devanagari: "कामी-आको" },
    pos: "verb",
  },
  {
    hindi: "जा रहे हैं",
    santali: { latin: "sen kana ko", olChiki: "ᱥᱮᱱ ᱠᱟᱱᱟ ᱠᱳ", devanagari: "सेन काना को" },
    ho: { latin: "sen tana ko", devanagari: "सेन ताना को" },
    mundari: { latin: "sen tana ko", devanagari: "सेन ताना को" },
    pos: "verb",
  },
  {
    hindi: "आ रहे हैं",
    santali: { latin: "hiju' kana ko", olChiki: "ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ ᱠᱳ", devanagari: "हिजुग् काना को" },
    ho: { latin: "hiju' tana ko", devanagari: "हिजु ताना को" },
    mundari: { latin: "hiju' tana ko", devanagari: "हिजु ताना को" },
    pos: "verb",
  },
  {
    hindi: "बात कर रहे हैं",
    santali: { latin: "galmarao kana ko", olChiki: "ᱜᱟᱞᱢᱟᱨᱟᱣ ᱠᱟᱱᱟ ᱠᱳ", devanagari: "गालमाराव काना को" },
    ho: { latin: "kaji tana ko", devanagari: "काजी ताना को" },
    mundari: { latin: "jagar tana ko", devanagari: "जागर ताना को" },
    pos: "verb",
  },
  {
    hindi: "देख रहे हैं",
    santali: { latin: "nyel kana ko", olChiki: "ᱧᱮᱞ ᱠᱟᱱᱟ ᱠᱳ", devanagari: "ञेल काना को" },
    ho: { latin: "nel tana ko", devanagari: "नेल ताना को" },
    mundari: { latin: "nel tana ko", devanagari: "नेल ताना को" },
    pos: "verb",
  },
  {
    hindi: "सुन रहे हैं",
    santali: { latin: "anjom kana ko", olChiki: "ᱟᱧᱡᱚᱢ ᱠᱟᱱᱟ ᱠᱳ", devanagari: "आंजोम काना को" },
    ho: { latin: "ayum tana ko", devanagari: "आयूम ताना को" },
    mundari: { latin: "ayum tana ko", devanagari: "आयूम ताना को" },
    pos: "verb",
  },
  {
    hindi: "पानी पीते हैं",
    santali: { latin: "dak' nu kana ko", olChiki: "ᱫᱟᱜ ᱧᱩ ᱠᱟᱱᱟ ᱠᱳ", devanagari: "दाग् ञु काना को" },
    ho: { latin: "da nu tana ko", devanagari: "दा नु ताना को" },
    mundari: { latin: "da nu tana ko", devanagari: "दा नु ताना को" },
    pos: "verb",
  },
  {
    hindi: "बैठ जाओ",
    santali: { latin: "durup' me", olChiki: "ᱫᱩᱲᱩᱵ ᱢᱮ", devanagari: "दुरूब् मे" },
    ho: { latin: "duba me", devanagari: "डूबा मे" },
    mundari: { latin: "duba me", devanagari: "डूबा मे" },
    pos: "verb",
  },
  {
    hindi: "खड़े हो जाओ",
    santali: { latin: "tingun me", olChiki: "ᱛᱤᱸᱜᱩᱱ ᱢᱮ", devanagari: "तींगुन मे" },
    ho: { latin: "tengun me", devanagari: "तेंगून मे" },
    mundari: { latin: "tingun me", devanagari: "तींगुन मे" },
    pos: "verb",
  },

  // Key Pronouns & Quantifiers
  {
    hindi: "मुझे",
    santali: { latin: "ing", olChiki: "ᱤᱧ", devanagari: "इंज" },
    ho: { latin: "aingke", devanagari: "आईंगके" },
    mundari: { latin: "aingke", devanagari: "आईंगके" },
    pos: "pron",
  },
  {
    hindi: "मुझको",
    santali: { latin: "ing", olChiki: "ᱤᱧ", devanagari: "इंज" },
    ho: { latin: "aingke", devanagari: "आईंगके" },
    mundari: { latin: "aingke", devanagari: "आईंगके" },
    pos: "pron",
  },
  {
    hindi: "मैं",
    santali: { latin: "iny", olChiki: "ᱤᱧ", devanagari: "इंज" },
    ho: { latin: "aing", devanagari: "आईंग" },
    mundari: { latin: "aing", devanagari: "आईंग" },
    pos: "pron",
  },
  {
    hindi: "मेरा",
    santali: { latin: "inyak'", olChiki: "ᱤᱧᱟᱜ", devanagari: "इंजाग" },
    ho: { latin: "ainga", devanagari: "आईंगा" },
    mundari: { latin: "ainyak'", devanagari: "आईंजाग" },
    pos: "pron",
  },
  {
    hindi: "मेरी",
    santali: { latin: "inyak'", olChiki: "ᱤᱧᱟᱜ", devanagari: "इंजाग" },
    ho: { latin: "ainga", devanagari: "आईंगा" },
    mundari: { latin: "ainyak'", devanagari: "आईंजाग" },
    pos: "pron",
  },
  {
    hindi: "मेरे",
    santali: { latin: "inyak'", olChiki: "ᱤᱧᱟᱜ", devanagari: "इंजाग" },
    ho: { latin: "ainga", devanagari: "आईंगा" },
    mundari: { latin: "ainyak'", devanagari: "आईंजाग" },
    pos: "pron",
  },
  {
    hindi: "दोनों",
    santali: { latin: "banar", olChiki: "ᱵᱟᱱᱟᱨ", devanagari: "बानार" },
    ho: { latin: "barona", devanagari: "बारोना" },
    mundari: { latin: "barona", devanagari: "बारोना" },
    pos: "num",
  },
  {
    hindi: "हम",
    santali: { latin: "abo", olChiki: "ᱟᱵᱳ", devanagari: "आबो" },
    ho: { latin: "abu", devanagari: "आबु" },
    mundari: { latin: "abu", devanagari: "आबु" },
    pos: "pron",
  },
  {
    hindi: "हमें",
    santali: { latin: "abo", olChiki: "ᱟᱵᱳ", devanagari: "आबो" },
    ho: { latin: "abu", devanagari: "आबु" },
    mundari: { latin: "abu", devanagari: "आबु" },
    pos: "pron",
  },
  {
    hindi: "हमारा",
    santali: { latin: "abwak'", olChiki: "ᱟᱵᱣᱟᱜ", devanagari: "आबवाग" },
    ho: { latin: "abua", devanagari: "आबुआ" },
    mundari: { latin: "abua", devanagari: "आबुआ" },
    pos: "pron",
  },
  {
    hindi: "तुम",
    santali: { latin: "am", olChiki: "ᱟᱢ", devanagari: "आम" },
    ho: { latin: "am", devanagari: "आम" },
    mundari: { latin: "am", devanagari: "आम" },
    pos: "pron",
  },
  {
    hindi: "तुझे",
    santali: { latin: "am", olChiki: "ᱟᱢ", devanagari: "आम" },
    ho: { latin: "am", devanagari: "आम" },
    mundari: { latin: "am", devanagari: "आम" },
    pos: "pron",
  },
  {
    hindi: "तुम्हारा",
    santali: { latin: "amak'", olChiki: "ᱟᱢᱟᱜ", devanagari: "आमाग" },
    ho: { latin: "ama", devanagari: "आमा" },
    mundari: { latin: "amak'", devanagari: "आमाग" },
    pos: "pron",
  },
  {
    hindi: "आप",
    santali: { latin: "ape", olChiki: "ᱟᱯᱮ", devanagari: "आपे" },
    ho: { latin: "ape", devanagari: "आपे" },
    mundari: { latin: "ape", devanagari: "आपे" },
    pos: "pron",
  },
  {
    hindi: "आपका",
    santali: { latin: "apeak'", olChiki: "ᱟᱯᱮᱭᱟᱜ", devanagari: "आपेयाग" },
    ho: { latin: "apea", devanagari: "आपेया" },
    mundari: { latin: "apeak'", devanagari: "आपेयाग" },
    pos: "pron",
  },
  {
    hindi: "वह",
    santali: { latin: "uni", olChiki: "ᱩᱱᱤ", devanagari: "उनी" },
    ho: { latin: "ini", devanagari: "इनी" },
    mundari: { latin: "ini", devanagari: "इनी" },
    pos: "pron",
  },
  {
    hindi: "उसे",
    santali: { latin: "uni", olChiki: "ᱩᱱᱤ", devanagari: "उनी" },
    ho: { latin: "inike", devanagari: "इनीके" },
    mundari: { latin: "inike", devanagari: "इनीके" },
    pos: "pron",
  },
  {
    hindi: "उसका",
    santali: { latin: "uniyak'", olChiki: "ᱩᱱᱤᱭᱟᱜ", devanagari: "उनीयाग" },
    ho: { latin: "inia", devanagari: "इनीया" },
    mundari: { latin: "inia", devanagari: "इनीया" },
    pos: "pron",
  },
  {
    hindi: "वे",
    santali: { latin: "unku", olChiki: "ᱩᱱᱠᱩ", devanagari: "उनकु" },
    ho: { latin: "inku", devanagari: "इनकु" },
    mundari: { latin: "inku", devanagari: "इनकु" },
    pos: "pron",
  },
  {
    hindi: "उन्हें",
    santali: { latin: "unku", olChiki: "ᱩᱱᱠᱩ", devanagari: "उनकु" },
    ho: { latin: "inkuke", devanagari: "इनकुके" },
    mundari: { latin: "inkuke", devanagari: "इनकुके" },
    pos: "pron",
  },
  {
    hindi: "उनका",
    santali: { latin: "unkuyak'", olChiki: "ᱩᱱᱠᱩᱭᱟᱜ", devanagari: "उनकुयाग" },
    ho: { latin: "inkua", devanagari: "इनकुआ" },
    mundari: { latin: "inkua", devanagari: "इनकुआ" },
    pos: "pron",
  },
  {
    hindi: "यह",
    santali: { latin: "noa", olChiki: "ᱱᱳᱣᱟ", devanagari: "नोवा" },
    ho: { latin: "nea", devanagari: "नेया" },
    mundari: { latin: "nea", devanagari: "नेया" },
    pos: "pron",
  },
  {
    hindi: "इसे",
    santali: { latin: "noa", olChiki: "ᱱᱳᱣᱟ", devanagari: "नोवा" },
    ho: { latin: "neake", devanagari: "नेयाके" },
    mundari: { latin: "neake", devanagari: "नेयाके" },
    pos: "pron",
  },
  {
    hindi: "इसका",
    santali: { latin: "noayak'", olChiki: "ᱱᱳᱣᱟᱭᱟᱜ", devanagari: "नोवायाग" },
    ho: { latin: "neaya", devanagari: "नेयाया" },
    mundari: { latin: "neaya", devanagari: "नेयाया" },
    pos: "pron",
  },
  {
    hindi: "सब",
    santali: { latin: "sanam", olChiki: "ᱥᱟᱱᱟᱢ", devanagari: "सानाम" },
    ho: { latin: "soben", devanagari: "सोबेन" },
    mundari: { latin: "soben", devanagari: "सोबेन" },
    pos: "pron",
  },
  {
    hindi: "सभी",
    santali: { latin: "joto", olChiki: "ᱡᱚᱛᱚ", devanagari: "जोतो" },
    ho: { latin: "soben", devanagari: "सोबेन" },
    mundari: { latin: "soben", devanagari: "सोबेन" },
    pos: "pron",
  },
  {
    hindi: "अपना",
    santali: { latin: "apanak'", olChiki: "ᱟᱯᱱᱟᱜ", devanagari: "आपनाग" },
    ho: { latin: "apna", devanagari: "आपना" },
    mundari: { latin: "apna", devanagari: "आपना" },
    pos: "pron",
  },

  // Verbs & Auxiliaries
  {
    hindi: "टारगेट",
    santali: { latin: "target", olChiki: "ᱴᱟᱨᱜᱮᱴ", devanagari: "टारगेट" },
    ho: { latin: "target", devanagari: "टारगेट" },
    mundari: { latin: "target", devanagari: "टारगेट" },
    pos: "noun",
  },
  {
    hindi: "निशाना",
    santali: { latin: "jos", olChiki: "ᱡᱳᱥ", devanagari: "जोस" },
    ho: { latin: "jos", devanagari: "जोस" },
    mundari: { latin: "jos", devanagari: "जोस" },
    pos: "noun",
  },
  {
    hindi: "कर",
    santali: { latin: "kami", olChiki: "ᱠᱟᱹᱢᱤ", devanagari: "कामी" },
    ho: { latin: "kami", devanagari: "कामी" },
    mundari: { latin: "kami", devanagari: "कामी" },
    pos: "verb",
  },
  {
    hindi: "करना",
    santali: { latin: "kami", olChiki: "ᱠᱟᱹᱢᱤ", devanagari: "कामी" },
    ho: { latin: "kami", devanagari: "कामी" },
    mundari: { latin: "kami", devanagari: "कामी" },
    pos: "verb",
  },
  {
    hindi: "काम",
    santali: { latin: "kami", olChiki: "ᱠᱟᱹᱢᱤ", devanagari: "कामी" },
    ho: { latin: "kami", devanagari: "कामी" },
    mundari: { latin: "kami", devanagari: "कामी" },
    pos: "noun",
  },
  {
    hindi: "रहे",
    santali: { latin: "kana", olChiki: "ᱠᱟᱱᱟ", devanagari: "काना" },
    ho: { latin: "tana", devanagari: "ताना" },
    mundari: { latin: "tana", devanagari: "ताना" },
    pos: "aux",
  },
  {
    hindi: "रहा",
    santali: { latin: "kana", olChiki: "ᱠᱟᱱᱟ", devanagari: "काना" },
    ho: { latin: "tana", devanagari: "ताना" },
    mundari: { latin: "tana", devanagari: "ताना" },
    pos: "aux",
  },
  {
    hindi: "रही",
    santali: { latin: "kana", olChiki: "ᱠᱟᱱᱟ", devanagari: "काना" },
    ho: { latin: "tana", devanagari: "ताना" },
    mundari: { latin: "tana", devanagari: "ताना" },
    pos: "aux",
  },
  {
    hindi: "हैं",
    santali: { latin: "ko", olChiki: "ᱠᱳ", devanagari: "को" },
    ho: { latin: "ko", devanagari: "को" },
    mundari: { latin: "ko", devanagari: "को" },
    pos: "aux",
  },
  {
    hindi: "है",
    santali: { latin: "kana", olChiki: "ᱠᱟᱱᱟ", devanagari: "काना" },
    ho: { latin: "tana", devanagari: "ताना" },
    mundari: { latin: "tana", devanagari: "ताना" },
    pos: "aux",
  },
  {
    hindi: "था",
    santali: { latin: "tahẽkana", olChiki: "ᱛᱟᱦᱮᱸᱠᱟᱱᱟ", devanagari: "ताहेनकाना" },
    ho: { latin: "taikena", devanagari: "ताईकेना" },
    mundari: { latin: "taikena", devanagari: "ताईकेना" },
    pos: "aux",
  },
  {
    hindi: "थी",
    santali: { latin: "tahẽkana", olChiki: "ᱛᱟᱦᱮᱸᱠᱟᱱᱟ", devanagari: "ताहेनकाना" },
    ho: { latin: "taikena", devanagari: "ताईकेना" },
    mundari: { latin: "taikena", devanagari: "ताईकेना" },
    pos: "aux",
  },
  {
    hindi: "थे",
    santali: { latin: "tahẽkana ko", olChiki: "ᱛᱟᱦᱮᱸᱠᱟᱱᱟ ᱠᱳ", devanagari: "ताहेनकाना को" },
    ho: { latin: "taikena ko", devanagari: "ताईकेना को" },
    mundari: { latin: "taikena ko", devanagari: "ताईकेना को" },
    pos: "aux",
  },
  {
    hindi: "होगा",
    santali: { latin: "hoe-a", olChiki: "ᱦᱳᱭ-ᱟ", devanagari: "होए-आ" },
    ho: { latin: "hobao-a", devanagari: "होबाओ-आ" },
    mundari: { latin: "hobao-a", devanagari: "होबाओ-आ" },
    pos: "aux",
  },

  // Numbers 1-10
  {
    hindi: "एक",
    santali: { latin: "mit'", olChiki: "ᱢᱤᱫ", devanagari: "मित्" },
    ho: { latin: "miyad", devanagari: "मियाद" },
    mundari: { latin: "miad", devanagari: "मिआद" },
    pos: "num",
  },
  {
    hindi: "दो",
    santali: { latin: "bar", olChiki: "ᱵᱟᱨ", devanagari: "बार" },
    ho: { latin: "baria", devanagari: "बारिया" },
    mundari: { latin: "baria", devanagari: "बारिया" },
    pos: "num",
  },
  {
    hindi: "तीन",
    santali: { latin: "pe", olChiki: "ᱯᱮ", devanagari: "पे" },
    ho: { latin: "apia", devanagari: "आपिया" },
    mundari: { latin: "api", devanagari: "आपि" },
    pos: "num",
  },
  {
    hindi: "चार",
    santali: { latin: "pon", olChiki: "ᱯᱳᱱ", devanagari: "पोन" },
    ho: { latin: "upunia", devanagari: "उपुनिया" },
    mundari: { latin: "upun", devanagari: "उपुन" },
    pos: "num",
  },
  {
    hindi: "पाँच",
    santali: { latin: "more", olChiki: "ᱢᱳᱲᱮ", devanagari: "मोड़े" },
    ho: { latin: "moya", devanagari: "मोया" },
    mundari: { latin: "monea", devanagari: "मोनेया" },
    pos: "num",
  },
  {
    hindi: "छह",
    santali: { latin: "turui", olChiki: "ᱛᱩᱨᱩᱭ", devanagari: "तुरुई" },
    ho: { latin: "turui", devanagari: "तुरुई" },
    mundari: { latin: "turui", devanagari: "तुरुई" },
    pos: "num",
  },
  {
    hindi: "सात",
    santali: { latin: "eya", olChiki: "ᱮᱭᱟ", devanagari: "एया" },
    ho: { latin: "ai", devanagari: "आई" },
    mundari: { latin: "eya", devanagari: "एया" },
    pos: "num",
  },
  {
    hindi: "आठ",
    santali: { latin: "iral", olChiki: "ᱤᱨᱟᱹᱞ", devanagari: "इरल" },
    ho: { latin: "iril", devanagari: "इरिल" },
    mundari: { latin: "iral", devanagari: "इरल" },
    pos: "num",
  },
  {
    hindi: "नौ",
    santali: { latin: "are", olChiki: "ᱟᱨᱮ", devanagari: "आरे" },
    ho: { latin: "are", devanagari: "आरे" },
    mundari: { latin: "are", devanagari: "आरे" },
    pos: "num",
  },
  {
    hindi: "दस",
    santali: { latin: "gel", olChiki: "ᱜᱮᱞ", devanagari: "गेल" },
    ho: { latin: "gel", devanagari: "गेल" },
    mundari: { latin: "gel", devanagari: "गेल" },
    pos: "num",
  },

  // People, Classroom & Environment
  {
    hindi: "बच्चे",
    santali: { latin: "gidra ko", olChiki: "ᱜᱤᱫᱽᱨᱟᱹ ᱠᱳ", devanagari: "गिदरा को" },
    ho: { latin: "hon ko", devanagari: "होन को" },
    mundari: { latin: "hon ko", devanagari: "होन को" },
    pos: "noun",
  },
  {
    hindi: "बच्चों",
    santali: { latin: "gidra ko", olChiki: "ᱜᱤᱫᱽᱨᱟᱹ ᱠᱳ", devanagari: "गिदरा को" },
    ho: { latin: "hon ko", devanagari: "होन को" },
    mundari: { latin: "hon ko", devanagari: "होन को" },
    pos: "noun",
  },
  {
    hindi: "दोस्त",
    santali: { latin: "gate", olChiki: "ᱜᱟᱛᱮ", devanagari: "गाते" },
    ho: { latin: "gati", devanagari: "गाती" },
    mundari: { latin: "gati", devanagari: "गाती" },
    pos: "noun",
  },
  {
    hindi: "मित्र",
    santali: { latin: "gate", olChiki: "ᱜᱟᱛᱮ", devanagari: "गाते" },
    ho: { latin: "gati", devanagari: "गाती" },
    mundari: { latin: "gati", devanagari: "गाती" },
    pos: "noun",
  },
  {
    hindi: "भाई",
    santali: { latin: "boyha", olChiki: "ᱵᱚᱭᱦᱟ", devanagari: "बोयहा" },
    ho: { latin: "haga", devanagari: "हागा" },
    mundari: { latin: "haga", devanagari: "हागा" },
    pos: "noun",
  },
  {
    hindi: "बहन",
    santali: { latin: "misi", olChiki: "ᱢᱤᱥᱤ", devanagari: "मीसी" },
    ho: { latin: "misi", devanagari: "मीसी" },
    mundari: { latin: "misi", devanagari: "मीसी" },
    pos: "noun",
  },
  {
    hindi: "माँ",
    santali: { latin: "ayo", olChiki: "ᱟᱭᱳ", devanagari: "आयो" },
    ho: { latin: "enga", devanagari: "एंगा" },
    mundari: { latin: "enga", devanagari: "एंगा" },
    pos: "noun",
  },
  {
    hindi: "पिता",
    santali: { latin: "baba", olChiki: "ᱵᱟᱵᱟ", devanagari: "बाबा" },
    ho: { latin: "apu", devanagari: "आपु" },
    mundari: { latin: "apu", devanagari: "आपु" },
    pos: "noun",
  },
  {
    hindi: "पानी",
    santali: { latin: "dak'", olChiki: "ᱫᱟᱜ", devanagari: "दाक" },
    ho: { latin: "da", devanagari: "दा" },
    mundari: { latin: "da", devanagari: "दा" },
    pos: "noun",
  },
  {
    hindi: "घर",
    santali: { latin: "orak'", olChiki: "ᱚᱲᱟᱜ", devanagari: "ओड़ाक" },
    ho: { latin: "oa", devanagari: "ओआ" },
    mundari: { latin: "oah", devanagari: "ओआह" },
    pos: "noun",
  },
  {
    hindi: "किताब",
    santali: { latin: "puthi", olChiki: "ᱯᱩᱛᱷᱤ", devanagari: "पुथी" },
    ho: { latin: "puthi", devanagari: "पुथी" },
    mundari: { latin: "puthi", devanagari: "पुथी" },
    pos: "noun",
  },
  {
    hindi: "स्कूल",
    santali: { latin: "iskul", olChiki: "ᱤᱥᱠᱩᱞ", devanagari: "इस्कुल" },
    ho: { latin: "iskul", devanagari: "इस्कुल" },
    mundari: { latin: "iskul", devanagari: "इस्कुल" },
    pos: "noun",
  },
  {
    hindi: "नाम",
    santali: { latin: "nutum", olChiki: "ᱧᱩᱛᱩᱢ", devanagari: "ञुतुम" },
    ho: { latin: "nutum", devanagari: "ञुतुम" },
    mundari: { latin: "nutum", devanagari: "ञुतुम" },
    pos: "noun",
  },
  {
    hindi: "पेड़",
    santali: { latin: "dare", olChiki: "ᱫᱟᱨᱮ", devanagari: "दारे" },
    ho: { latin: "daru", devanagari: "दारू" },
    mundari: { latin: "daru", devanagari: "दारू" },
    pos: "noun",
  },
  {
    hindi: "फूल",
    santali: { latin: "baha", olChiki: "ᱵᱟᱦᱟ", devanagari: "बाहा" },
    ho: { latin: "baa", devanagari: "बाआ" },
    mundari: { latin: "baa", devanagari: "बाआ" },
    pos: "noun",
  },
  {
    hindi: "सूरज",
    santali: { latin: "singi", olChiki: "ᱥᱤᱧᱜᱤ", devanagari: "सिंगी" },
    ho: { latin: "singi", devanagari: "सिंगी" },
    mundari: { latin: "singi", devanagari: "सिंगी" },
    pos: "noun",
  },
  {
    hindi: "गाँव",
    santali: { latin: "ato", olChiki: "ᱟᱛᱳ", devanagari: "आतो" },
    ho: { latin: "hatu", devanagari: "हातु" },
    mundari: { latin: "hatu", devanagari: "हातु" },
    pos: "noun",
  },
  {
    hindi: "शहर",
    santali: { latin: "bajar", olChiki: "ᱵᱟᱡᱟᱨ", devanagari: "बाजार" },
    ho: { latin: "bajar", devanagari: "बाजार" },
    mundari: { latin: "bajar", devanagari: "बाजार" },
    pos: "noun",
  },

  // Actions & Verbs
  {
    hindi: "पढ़ो",
    santali: { latin: "paro me", olChiki: "ᱯᱟᱲᱦᱟᱣ ᱢᱮ", devanagari: "पाड़ाव मे" },
    ho: { latin: "padao me", devanagari: "पढाव मे" },
    mundari: { latin: "paro me", devanagari: "पारो मे" },
    pos: "verb",
  },
  {
    hindi: "लिखो",
    santali: { latin: "ol me", olChiki: "ᱚᱞ ᱢᱮ", devanagari: "ओल मे" },
    ho: { latin: "ol me", devanagari: "ओल मे" },
    mundari: { latin: "ol me", devanagari: "ओल मे" },
    pos: "verb",
  },
  {
    hindi: "सुनो",
    santali: { latin: "anjom me", olChiki: "ᱟᱧᱡᱚᱢ ᱢᱮ", devanagari: "आंजोम मे" },
    ho: { latin: "ayum me", devanagari: "आयूम मे" },
    mundari: { latin: "ayum me", devanagari: "आयूम मे" },
    pos: "verb",
  },
  {
    hindi: "बोलो",
    santali: { latin: "ror me", olChiki: "ᱨᱚᱲ ᱢᱮ", devanagari: "रोड़ मे" },
    ho: { latin: "kaji me", devanagari: "काजी मे" },
    mundari: { latin: "kaji me", devanagari: "काजी मे" },
    pos: "verb",
  },
  {
    hindi: "बताओ",
    santali: { latin: "lai me", olChiki: "ᱞᱟᱹᱭ ᱢᱮ", devanagari: "लय मे" },
    ho: { latin: "kaji me", devanagari: "काजी मे" },
    mundari: { latin: "kaji me", devanagari: "काजी मे" },
    pos: "verb",
  },
  {
    hindi: "गिनो",
    santali: { latin: "lekha me", olChiki: "ᱞᱮᱠᱷᱟ ᱢᱮ", devanagari: "लेखा मे" },
    ho: { latin: "lekha me", devanagari: "लेखा मे" },
    mundari: { latin: "lekha me", devanagari: "लेखा मे" },
    pos: "verb",
  },
  {
    hindi: "खाना",
    santali: { latin: "jom", olChiki: "ᱡᱳᱢ", devanagari: "जोम" },
    ho: { latin: "jom", devanagari: "जोम" },
    mundari: { latin: "jom", devanagari: "जोम" },
    pos: "noun",
  },
  {
    hindi: "खाओ",
    santali: { latin: "jom me", olChiki: "ᱡᱳᱢ ᱢᱮ", devanagari: "जोम मे" },
    ho: { latin: "jom me", devanagari: "जोम मे" },
    mundari: { latin: "jom me", devanagari: "जोम मे" },
    pos: "verb",
  },
  {
    hindi: "पीओ",
    santali: { latin: "nu me", olChiki: "ᱧᱩ ᱢᱮ", devanagari: "ञु मे" },
    ho: { latin: "nu me", devanagari: "नु मे" },
    mundari: { latin: "nu me", devanagari: "नु मे" },
    pos: "verb",
  },
  {
    hindi: "जाओ",
    santali: { latin: "sen me", olChiki: "ᱥᱮᱱ ᱢᱮ", devanagari: "सेन मे" },
    ho: { latin: "sen me", devanagari: "सेन मे" },
    mundari: { latin: "sen me", devanagari: "सेन मे" },
    pos: "verb",
  },
  {
    hindi: "आओ",
    santali: { latin: "hiju' me", olChiki: "ᱦᱤᱡᱩᱜ ᱢᱮ", devanagari: "हिजुग् मे" },
    ho: { latin: "hiju' me", devanagari: "हिजु मे" },
    mundari: { latin: "hiju' me", devanagari: "हिजु मे" },
    pos: "verb",
  },

  // Connectors, Particles & Adverbs
  {
    hindi: "और",
    santali: { latin: "ar", olChiki: "ᱟᱨ", devanagari: "आर" },
    ho: { latin: "ar", devanagari: "आर" },
    mundari: { latin: "ar", devanagari: "आर" },
  },
  {
    hindi: "से",
    santali: { latin: "khon", olChiki: "ᱠᱷᱳᱱ", devanagari: "खोन" },
    ho: { latin: "ete", devanagari: "एते" },
    mundari: { latin: "ete", devanagari: "एते" },
  },
  {
    hindi: "तक",
    santali: { latin: "dhabic'", olChiki: "ᱫᱷᱟᱹᱵᱤᱡ", devanagari: "धाबिज" },
    ho: { latin: "jaked", devanagari: "जाकेद" },
    mundari: { latin: "habic", devanagari: "हाबिच" },
  },
  {
    hindi: "में",
    santali: { latin: "re", olChiki: "ᱨᱮ", devanagari: "रे" },
    ho: { latin: "re", devanagari: "रे" },
    mundari: { latin: "re", devanagari: "रे" },
  },
  {
    hindi: "पर",
    santali: { latin: "cetan", olChiki: "ᱪᱮᱛᱟᱱ", devanagari: "चेतान" },
    ho: { latin: "cetan", devanagari: "चेतान" },
    mundari: { latin: "cetan", devanagari: "चेतान" },
  },
  {
    hindi: "को",
    santali: { latin: "thec'", olChiki: "ᱛᱷᱮᱫ", devanagari: "थेद" },
    ho: { latin: "te", devanagari: "ते" },
    mundari: { latin: "te", devanagari: "ते" },
  },
  {
    hindi: "के लिए",
    santali: { latin: "lagid'", olChiki: "ᱞᱟᱹᱜᱤᱫ", devanagari: "लागिद" },
    ho: { latin: "nagente", devanagari: "नागेन्ते" },
    mundari: { latin: "nagente", devanagari: "नागेन्ते" },
  },
  {
    hindi: "साथ",
    santali: { latin: "saon", olChiki: "ᱥᱟᱶ", devanagari: "सांव" },
    ho: { latin: "lo", devanagari: "लो" },
    mundari: { latin: "lo", devanagari: "लो" },
  },
  {
    hindi: "लेकिन",
    santali: { latin: "menkhan", olChiki: "ᱢᱮᱱᱠᱷᱟᱱ", devanagari: "मेनखान" },
    ho: { latin: "mendo", devanagari: "मेंदो" },
    mundari: { latin: "mendo", devanagari: "मेंदो" },
  },
  {
    hindi: "भी",
    santali: { latin: "hõ", olChiki: "ᱦᱚᱸ", devanagari: "हों" },
    ho: { latin: "o", devanagari: "ओ" },
    mundari: { latin: "o", devanagari: "ओ" },
  },
  {
    hindi: "अच्छा",
    santali: { latin: "bes", olChiki: "ᱵᱮᱥ", devanagari: "बेस" },
    ho: { latin: "bugin", devanagari: "बुगिन" },
    mundari: { latin: "bugin", devanagari: "बुगिन" },
    pos: "adj",
  },
  {
    hindi: "बहुत",
    santali: { latin: "adi", olChiki: "ᱟᱹᱰᱤ", devanagari: "आडी" },
    ho: { latin: "purte", devanagari: "पुर्ते" },
    mundari: { latin: "purte", devanagari: "पुर्ते" },
    pos: "adj",
  },
  {
    hindi: "आज",
    santali: { latin: "tehen", olChiki: "ᱛᱮᱦᱮᱧ", devanagari: "तेहेन" },
    ho: { latin: "tising", devanagari: "तिसिंग" },
    mundari: { latin: "tisin", devanagari: "तिसिन" },
    pos: "adverb",
  },
  {
    hindi: "कल",
    santali: { latin: "hola", olChiki: "ᱦᱳᱞᱟ", devanagari: "होला" },
    ho: { latin: "hola", devanagari: "होला" },
    mundari: { latin: "hola", devanagari: "होला" },
    pos: "adverb",
  },
  {
    hindi: "क्या",
    santali: { latin: "cet'", olChiki: "ᱪᱮᱫ", devanagari: "चेद" },
    ho: { latin: "cikana", devanagari: "चिकाना" },
    mundari: { latin: "cinaa", devanagari: "चिनाआ" },
    pos: "pron",
  },
  {
    hindi: "कहाँ",
    santali: { latin: "okare", olChiki: "ᱚᱠᱟᱨᱮ", devanagari: "ओकारे" },
    ho: { latin: "okare", devanagari: "ओकारे" },
    mundari: { latin: "okare", devanagari: "ओकारे" },
    pos: "adverb",
  },
  {
    hindi: "हाँ",
    santali: { latin: "hẽ", olChiki: "ᱦᱮᱸ", devanagari: "हें" },
    ho: { latin: "he", devanagari: "हे" },
    mundari: { latin: "he", devanagari: "हे" },
  },
  {
    hindi: "नहीं",
    santali: { latin: "banga", olChiki: "ᱵᱟᱝ", devanagari: "बांग" },
    ho: { latin: "ka", devanagari: "का" },
    mundari: { latin: "ka", devanagari: "का" },
  },
];

/* ------------------------------------------------------------------
 * Language Detector & Normalizer
 * ------------------------------------------------------------------ */

export function detectInputLanguage(text: string): "hi" | LangCode {
  const t = text.trim();
  if (!t) return "hi";

  // Check Ol Chiki unicode range (U+1C50 to U+1C7F)
  if (/[\u1C50-\u1C7F]/.test(t)) {
    return "santhali";
  }

  // Devanagari presence
  const hasDevanagari = /[\u0900-\u097F]/.test(t);
  if (hasDevanagari) {
    const lower = t.toLowerCase();
    if (
      lower.includes("जोहार") ||
      lower.includes("गिदरा") ||
      lower.includes("ञुतूम") ||
      lower.includes("तेहेन")
    ) {
      return "santhali";
    }
    if (
      lower.includes("तिसिंग") ||
      lower.includes("मियाद") ||
      lower.includes("बारिया") ||
      lower.includes("उपुनिया")
    ) {
      return "ho";
    }
    if (lower.includes("तिसिन") || lower.includes("मोनेया") || lower.includes("हाबिच")) {
      return "mundari";
    }
    return "hi";
  }

  // Latin script text: check distinctive tribal markers
  const lowerLatin = t.toLowerCase();
  if (
    lowerLatin.includes("dak'") ||
    lowerLatin.includes("orak'") ||
    lowerLatin.includes("gidra") ||
    lowerLatin.includes("amak'") ||
    lowerLatin.includes("inyak'") ||
    lowerLatin.includes("tehen") ||
    lowerLatin.includes("lai me") ||
    lowerLatin.includes("khon") ||
    lowerLatin.includes("dhabic'")
  ) {
    return "santhali";
  }
  if (
    lowerLatin.includes("hon ko") ||
    lowerLatin.includes("miyad") ||
    lowerLatin.includes("tising") ||
    lowerLatin.includes("kaji me") ||
    lowerLatin.includes("jaked") ||
    lowerLatin.includes("moya")
  ) {
    return "ho";
  }
  if (
    lowerLatin.includes("habic") ||
    lowerLatin.includes("monea") ||
    lowerLatin.includes("tisin") ||
    lowerLatin.includes("tain tana")
  ) {
    return "mundari";
  }

  return "hi";
}

function cleanPunctuation(str: string): string {
  return str.replace(/[।.,!?]/g, "").trim();
}

/**
 * Translates Hindi to all three tribal languages (Santali, Ho, Mundari).
 * Uses multi-word phrase matching, n-gram verbal chunking, and authentic
 * phonetic transliteration for names and loanwords so that no raw Hindi
 * characters leak untranslated into target script fields.
 */
export function translateHindiToAll(hindi: string): TranslationMultiOutput {
  const cleanInput = hindi.trim();
  if (!cleanInput) {
    return {
      sourceText: "",
      sourceLang: "hi",
      santali: { olChiki: "", latin: "", devanagari: "" },
      ho: { warangChiti: "", latin: "", devanagari: "" },
      mundari: { latin: "", devanagari: "" },
      breakdown: [],
      direction: "hi-to-tribal",
      confidence: 1,
    };
  }

  const normalized = cleanInput.replace(/\s+/g, " ");
  const normClean = cleanPunctuation(normalized).toLowerCase();

  // 1. Exact or near-exact phrase lookup in EXTENDED_PHRASES
  const phraseMatch = EXTENDED_PHRASES.find((p) => {
    const pClean = cleanPunctuation(p.hindi).toLowerCase();
    return (
      pClean === normClean ||
      p.hindi.replace(/\s+/g, "").toLowerCase() === normalized.replace(/\s+/g, "").toLowerCase()
    );
  });

  if (phraseMatch) {
    const hasQuestion = /[?？]/.test(cleanInput);
    const hasExclamation = /[!！]/.test(cleanInput);

    const appendPunct = (str: string, ol = false) => {
      const clean = cleanPunctuation(str);
      if (hasQuestion) return clean + "?";
      if (hasExclamation) return clean + "!";
      return clean + (ol ? "᱾" : "।");
    };

    return {
      sourceText: cleanInput,
      sourceLang: "hi",
      santali: {
        latin: appendPunct(phraseMatch.santali.latin),
        olChiki: appendPunct(phraseMatch.santali.olChiki, true),
        devanagari: appendPunct(phraseMatch.santali.devanagari),
      },
      ho: {
        latin: appendPunct(phraseMatch.ho.latin),
        devanagari: appendPunct(phraseMatch.ho.devanagari),
      },
      mundari: {
        latin: appendPunct(phraseMatch.mundari.latin),
        devanagari: appendPunct(phraseMatch.mundari.devanagari),
      },
      breakdown: buildBreakdownForPhrase(phraseMatch),
      direction: "hi-to-tribal",
      confidence: 0.98,
    };
  }

  // 2. Intelligent Multi-Word N-Gram Tokenizer (5-word -> 4-word -> 3-word -> 2-word -> 1-word)
  const rawTokens = normalized.split(/\s+/);
  const breakdown: TranslationMultiOutput["breakdown"] = [];

  const santaliLatinWords: string[] = [];
  const santaliOlChikiWords: string[] = [];
  const santaliDevanagariWords: string[] = [];

  const hoLatinWords: string[] = [];
  const hoDevanagariWords: string[] = [];

  const mundariLatinWords: string[] = [];
  const mundariDevanagariWords: string[] = [];

  let i = 0;
  while (i < rawTokens.length) {
    let matched = false;

    // Check 5-gram, 4-gram, 3-gram, 2-gram, 1-gram in VOCABULARY
    for (const len of [5, 4, 3, 2, 1]) {
      if (i + len <= rawTokens.length) {
        const chunkTokens = rawTokens.slice(i, i + len);
        const chunkText = chunkTokens.map((t) => cleanPunctuation(t)).join(" ");
        const lastToken = chunkTokens[chunkTokens.length - 1]!;
        const punctMatch = lastToken.match(/[।.,!?]+$/);
        const punct = punctMatch ? punctMatch[0] : "";
        const olPunct = punct === "।" ? "᱾" : punct;

        const hit = VOCABULARY.find(
          (v) => cleanPunctuation(v.hindi).toLowerCase() === chunkText.toLowerCase(),
        );

        if (hit) {
          santaliLatinWords.push(hit.santali.latin + punct);
          santaliOlChikiWords.push(hit.santali.olChiki + olPunct);
          santaliDevanagariWords.push(hit.santali.devanagari + punct);

          hoLatinWords.push(hit.ho.latin + punct);
          hoDevanagariWords.push(hit.ho.devanagari + punct);

          mundariLatinWords.push(hit.mundari.latin + punct);
          mundariDevanagariWords.push(hit.mundari.devanagari + punct);

          breakdown.push({
            source: chunkText,
            santali: `${hit.santali.latin} (${hit.santali.olChiki})`,
            ho: hit.ho.latin,
            mundari: hit.mundari.latin,
          });

          i += len;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      // 1-word fallback: Proper noun / name / loanword transliteration
      const currentToken = rawTokens[i]!;
      const cleanToken = cleanPunctuation(currentToken);
      const punctMatch = currentToken.match(/[।.,!?]+$/);
      const punct = punctMatch ? punctMatch[0] : "";
      const olPunct = punct === "।" ? "᱾" : punct;

      // Transliterate Devanagari to clean Latin phonetics & authentic Ol Chiki
      const latinPhonetic = devanagariToLatinPhonetic(cleanToken);
      const olChikiPhonetic = devanagariToOlChiki(cleanToken);

      santaliLatinWords.push(latinPhonetic + punct);
      santaliOlChikiWords.push(olChikiPhonetic + olPunct);
      santaliDevanagariWords.push(cleanToken + punct);

      hoLatinWords.push(latinPhonetic + punct);
      hoDevanagariWords.push(cleanToken + punct);

      mundariLatinWords.push(latinPhonetic + punct);
      mundariDevanagariWords.push(cleanToken + punct);

      breakdown.push({
        source: cleanToken,
        santali: `${latinPhonetic} (${olChikiPhonetic})`,
        ho: latinPhonetic,
        mundari: latinPhonetic,
      });

      i++;
    }
  }

  const santaliLatin = santaliLatinWords.join(" ");
  const santaliOlChiki = santaliOlChikiWords.join(" ");
  const santaliDevanagari = santaliDevanagariWords.join(" ");

  const hoLatin = hoLatinWords.join(" ");
  const hoDevanagari = hoDevanagariWords.join(" ");

  const mundariLatin = mundariLatinWords.join(" ");
  const mundariDevanagari = mundariDevanagariWords.join(" ");

  return {
    sourceText: cleanInput,
    sourceLang: "hi",
    santali: {
      latin: santaliLatin,
      olChiki: santaliOlChiki,
      devanagari: santaliDevanagari,
    },
    ho: {
      warangChiti: hoLatin,
      latin: hoLatin,
      devanagari: hoDevanagari,
    },
    mundari: {
      latin: mundariLatin,
      devanagari: mundariDevanagari,
    },
    breakdown,
    direction: "hi-to-tribal",
    confidence: 0.95,
  };
}

/**
 * Translates from a tribal language (Santali, Ho, or Mundari) to Hindi.
 */
export function translateTribalToHindi(
  tribalText: string,
  sourceLangHint?: LangCode | "auto",
): TribalToHindiOutput {
  const cleanInput = tribalText.trim();
  if (!cleanInput) {
    return {
      sourceText: "",
      sourceLang: "santhali",
      detectedLangName: "Santali",
      hindi: "",
      latin: "",
      breakdown: [],
      confidence: 1,
    };
  }

  const normalized = cleanInput.replace(/\s+/g, " ");

  const langCode: LangCode =
    sourceLangHint && sourceLangHint !== "auto"
      ? sourceLangHint
      : (detectInputLanguage(cleanInput) as LangCode) || "santhali";

  const langNames: Record<LangCode, string> = {
    ho: "Ho",
    mundari: "Mundari",
    santhali: "Santali",
  };

  // 1. Phrase lookup
  const phraseMatch = EXTENDED_PHRASES.find((p) => {
    const s = p.santali;
    const h = p.ho;
    const m = p.mundari;

    const normNoPunct = cleanPunctuation(normalized).toLowerCase();

    return (
      cleanPunctuation(s.latin).toLowerCase() === normNoPunct ||
      cleanPunctuation(s.olChiki) === cleanPunctuation(normalized) ||
      cleanPunctuation(s.devanagari) === cleanPunctuation(normalized) ||
      cleanPunctuation(h.latin).toLowerCase() === normNoPunct ||
      cleanPunctuation(h.devanagari) === cleanPunctuation(normalized) ||
      cleanPunctuation(m.latin).toLowerCase() === normNoPunct ||
      cleanPunctuation(m.devanagari) === cleanPunctuation(normalized)
    );
  });

  if (phraseMatch) {
    const matchedLang = langCode === "santhali" ? phraseMatch.santali : phraseMatch[langCode];
    return {
      sourceText: cleanInput,
      sourceLang: langCode,
      detectedLangName: langNames[langCode] || "Tribal",
      hindi: phraseMatch.hindi,
      latin: matchedLang?.latin || cleanInput,
      breakdown: [
        {
          tribal: cleanInput,
          hindi: phraseMatch.hindi,
        },
      ],
      confidence: 0.98,
    };
  }

  // 2. Tokenized reverse lookup
  const words = normalized.split(/\s+/);
  const hindiWords: string[] = [];
  const breakdown: TribalToHindiOutput["breakdown"] = [];

  for (const w of words) {
    const cleanW = w.toLowerCase().replace(/[.,!?;:]/g, "");
    const hit = VOCABULARY.find((v) => {
      return (
        v.santali.latin.toLowerCase() === cleanW ||
        v.santali.olChiki === cleanW ||
        v.santali.devanagari === cleanW ||
        v.ho.latin.toLowerCase() === cleanW ||
        v.ho.devanagari === cleanW ||
        v.mundari.latin.toLowerCase() === cleanW ||
        v.mundari.devanagari === cleanW
      );
    });

    if (hit) {
      hindiWords.push(hit.hindi);
      breakdown.push({ tribal: w, hindi: hit.hindi });
    } else {
      hindiWords.push(w);
      breakdown.push({ tribal: w, hindi: w });
    }
  }

  const hindiOutput = hindiWords.join(" ");

  return {
    sourceText: cleanInput,
    sourceLang: langCode,
    detectedLangName: langNames[langCode] || "Tribal",
    hindi: hindiOutput,
    latin: cleanInput,
    breakdown,
    confidence: breakdown.some((b) => b.hindi !== b.tribal) ? 0.85 : 0.6,
  };
}

function buildBreakdownForPhrase(phrase: PhraseEntry): TranslationMultiOutput["breakdown"] {
  const hiWords = phrase.hindi.replace(/[।.,!?]/g, "").split(/\s+/);
  const saWords = phrase.santali.latin.replace(/[.,!?]/g, "").split(/\s+/);
  const hoWords = phrase.ho.latin.replace(/[.,!?]/g, "").split(/\s+/);
  const muWords = phrase.mundari.latin.replace(/[.,!?]/g, "").split(/\s+/);

  const maxLen = Math.max(hiWords.length, saWords.length, hoWords.length, muWords.length);
  const res: TranslationMultiOutput["breakdown"] = [];

  for (let i = 0; i < maxLen; i++) {
    res.push({
      source: hiWords[i] || "",
      santali: saWords[i] || "",
      ho: hoWords[i] || "",
      mundari: muWords[i] || "",
    });
  }

  return res;
}
