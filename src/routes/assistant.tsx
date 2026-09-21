import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useLanguage, type LangCode } from "@/lib/lang";
import {
  translateHindiToAll,
  translateTribalToHindi,
  detectInputLanguage,
  type TranslationMultiOutput,
  type TribalToHindiOutput,
} from "@/lib/translation-engine";
import {
  createRecognition,
  describeVoiceRecognitionError,
  playChime,
  readTranscript,
  requestMicrophonePermission,
  speak,
  speakSequence,
  stopSpeaking,
} from "@/lib/speech";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Voice Assistant — BhashaMitra" },
      {
        name: "description",
        content:
          "AI Voice Assistant for bidirectional translation between Hindi and Santali, Ho, and Mundari with audio readout and text generation.",
      },
      { property: "og:title", content: "AI Voice Assistant — BhashaMitra" },
      {
        property: "og:description",
        content:
          "Listen and speak in Hindi or Santali, Ho, and Mundari. Hear synthesized voice translation and see generated text below.",
      },
    ],
  }),
  component: AssistantPage,
});

type TranslationMode = "hi-to-all" | "tribal-to-hi";

interface HistoryItem {
  id: string;
  mode: TranslationMode;
  source: string;
  sourceLangLabel: string;
  targetSummary: string;
  timestamp: string;
}

const PRESET_HINDI_PROMPTS = [
  { label: "गिनती (Numbers)", text: "एक से दस तक गिनो।" },
  { label: "जोड़ (Addition)", text: "बच्चों, आज हम तीन और दो का जोड़ सीखेंगे।" },
  { label: "नाम (Name prompt)", text: "अपना नाम बताओ।" },
  { label: "पढ़ाई (Reading)", text: "किताब खोलो और पढ़ो।" },
  { label: "कक्षा (Discipline)", text: "सब बच्चे बैठ जाओ।" },
  { label: "नमस्ते (Greeting)", text: "जोहार, आप कैसे हैं?" },
  { label: "भोजन (Dialogue)", text: "कल तुमने क्या खाना खाया था?" },
  { label: "पानी (Daily)", text: "पानी लाओ।" },
];

const PRESET_TRIBAL_PROMPTS = [
  { lang: "santhali" as LangCode, label: "Santali: नाम", text: "Amak' nutum lai me." },
  { lang: "ho" as LangCode, label: "Ho: नाम", text: "Ama nutum kaji me." },
  { lang: "mundari" as LangCode, label: "Mundari: बैठो", text: "Soben hon ko duba pe." },
  { lang: "santhali" as LangCode, label: "Santali: जोहार", text: "Johar, am cet' leka menama?" },
  { lang: "ho" as LangCode, label: "Ho: पानी लाओ", text: "Da agu me." },
  {
    lang: "santhali" as LangCode,
    label: "Ol Chiki (Santali)",
    text: "ᱢᱤᱫ ᱠᱷᱳᱱ ᱜᱮᱞ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟ ᱢᱮ᱾",
  },
];

function AssistantPage() {
  const { language, select } = useLanguage();
  const [mode, setMode] = useState<TranslationMode>("hi-to-all");
  const [selectedTribalSource, setSelectedTribalSource] = useState<LangCode | "auto">("auto");

  // Input & Status
  const [inputText, setInputText] = useState("एक से दस तक गिनो।");
  const [listening, setListening] = useState(false);
  const [activeSpeechLang, setActiveSpeechLang] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [micError, setMicError] = useState<string>("");

  // Translation Results
  const [hiToAllResult, setHiToAllResult] = useState<TranslationMultiOutput | null>(() =>
    translateHindiToAll("एक से दस तक गिनो।"),
  );
  const [tribalResult, setTribalResult] = useState<TribalToHindiOutput | null>(null);

  // History log
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "init-1",
      mode: "hi-to-all",
      source: "एक से दस तक गिनो।",
      sourceLangLabel: "Hindi",
      targetSummary: "Santali: Mit' khon gel... · Ho: Miyad ete gel... · Mundari: Miad ete gel...",
      timestamp: "Just now",
    },
  ]);

  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);
  const latestSpokenText = useRef<string>("");
  const hasTranslatedUtterance = useRef<boolean>(false);

  function handleTranslate(textToTranslate?: string) {
    const text = (textToTranslate !== undefined ? textToTranslate : inputText).trim();
    if (!text) return;

    playChime("tap");

    if (mode === "hi-to-all") {
      const res = translateHindiToAll(text);
      setHiToAllResult(res);
      setTribalResult(null);

      // Add to history if not duplicate of latest
      setHistory((prev) => {
        if (prev[0]?.source === text && prev[0]?.mode === "hi-to-all") return prev;
        return [
          {
            id: String(Date.now()),
            mode: "hi-to-all",
            source: text,
            sourceLangLabel: "Hindi",
            targetSummary: `Santali: ${res.santali.latin} · Ho: ${res.ho.latin} · Mundari: ${res.mundari.latin}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...prev.slice(0, 9),
        ];
      });
    } else {
      const res = translateTribalToHindi(text, selectedTribalSource);
      setTribalResult(res);
      setHiToAllResult(null);

      setHistory((prev) => {
        if (prev[0]?.source === text && prev[0]?.mode === "tribal-to-hi") return prev;
        return [
          {
            id: String(Date.now()),
            mode: "tribal-to-hi",
            source: text,
            sourceLangLabel: res.detectedLangName,
            targetSummary: `Hindi: ${res.hindi}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...prev.slice(0, 9),
        ];
      });
    }
  }

  // Real-time live translation debounce for typing/pasting
  useEffect(() => {
    if (listening) return;
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const timer = setTimeout(() => {
      if (mode === "hi-to-all") {
        const res = translateHindiToAll(trimmed);
        setHiToAllResult(res);
      } else {
        const res = translateTribalToHindi(trimmed, selectedTribalSource);
        setTribalResult(res);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText, mode, selectedTribalSource, listening]);

  function handleSwitchMode(newMode: TranslationMode) {
    stopSpeaking();
    setActiveSpeechLang(null);
    setMode(newMode);
    if (newMode === "hi-to-all") {
      const defaultText = "बच्चों, आज हम तीन और दो का जोड़ सीखेंगे।";
      setInputText(defaultText);
      const res = translateHindiToAll(defaultText);
      setHiToAllResult(res);
      setTribalResult(null);
    } else {
      const defaultText = "Amak' nutum lai me.";
      setInputText(defaultText);
      const res = translateTribalToHindi(defaultText, selectedTribalSource);
      setTribalResult(res);
      setHiToAllResult(null);
    }
  }

  async function startVoiceListening() {
    stopSpeaking();
    setActiveSpeechLang(null);

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setMicError("Microphone access is blocked. Please allow permission and try again.");
      return;
    }
    setMicError("");

    const langToListen = mode === "hi-to-all" ? "hi-IN" : "en-IN";
    const rec = createRecognition(langToListen);

    if (!rec) {
      setMicError("Microphone recognition is not supported in this browser. Please type your sentence.");
      return;
    }

    latestSpokenText.current = "";
    hasTranslatedUtterance.current = false;
    recognitionRef.current = rec;
    playChime("start");
    setListening(true);

    rec.onresult = (e: unknown) => {
      const { text, final } = readTranscript(e);
      if (text) {
        latestSpokenText.current = text;
        setInputText(text);
        if (final && !hasTranslatedUtterance.current) {
          hasTranslatedUtterance.current = true;
          setListening(false);
          playChime("success");
          handleTranslate(text);
        }
      }
    };

    rec.onerror = (event: unknown) => {
      setListening(false);
      setMicError(describeVoiceRecognitionError(event));
      const text = (latestSpokenText.current || inputText).trim();
      if (text && !hasTranslatedUtterance.current) {
        hasTranslatedUtterance.current = true;
        handleTranslate(text);
      }
    };

    rec.onend = () => {
      setListening(false);
      const text = (latestSpokenText.current || inputText).trim();
      if (text && !hasTranslatedUtterance.current) {
        hasTranslatedUtterance.current = true;
        playChime("success");
        handleTranslate(text);
      }
    };

    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }

  function stopVoiceListening() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // no-op
      }
    }
    setListening(false);
    const text = (latestSpokenText.current || inputText).trim();
    if (text && !hasTranslatedUtterance.current) {
      hasTranslatedUtterance.current = true;
      playChime("success");
      handleTranslate(text);
    }
  }

  // Sequential readout: reads the sentences across all target languages
  function handleReadOutAll() {
    if (mode === "hi-to-all" && hiToAllResult) {
      stopSpeaking();
      playChime("tap");

      const items = [
        {
          text: `हिंदी में: ${hiToAllResult.sourceText}`,
          lang: "hi-IN",
          label: "Hindi",
          rate: speechRate,
        },
        {
          text: `संथाली में: ${hiToAllResult.santali.latin}`,
          lang: "hi-IN",
          label: "Santali",
          rate: speechRate,
        },
        {
          text: `हो में: ${hiToAllResult.ho.latin}`,
          lang: "hi-IN",
          label: "Ho",
          rate: speechRate,
        },
        {
          text: `मुंडारी में: ${hiToAllResult.mundari.latin}`,
          lang: "hi-IN",
          label: "Mundari",
          rate: speechRate,
        },
      ];

      speakSequence(items, {
        onStartItem: (_idx, item) => {
          setActiveSpeechLang(item.label || null);
        },
        onComplete: () => {
          setActiveSpeechLang(null);
        },
      });
    } else if (mode === "tribal-to-hi" && tribalResult) {
      stopSpeaking();
      playChime("tap");

      const items = [
        {
          text: `${tribalResult.detectedLangName} में: ${tribalResult.latin || tribalResult.sourceText}`,
          lang: "hi-IN",
          label: tribalResult.detectedLangName,
          rate: speechRate,
        },
        {
          text: `हिंदी अनुवाद: ${tribalResult.hindi}`,
          lang: "hi-IN",
          label: "Hindi",
          rate: speechRate,
        },
      ];

      speakSequence(items, {
        onStartItem: (_idx, item) => {
          setActiveSpeechLang(item.label || null);
        },
        onComplete: () => {
          setActiveSpeechLang(null);
        },
      });
    }
  }

  function handleSpeakSingle(text: string, lang = "hi-IN", label: string) {
    stopSpeaking();
    setActiveSpeechLang(label);
    speak(text, lang, {
      rate: speechRate,
      onEnd: () => setActiveSpeechLang(null),
    });
  }

  function copyToClipboard(text: string, key: string) {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    }
  }

  return (
    <AppShell language={language} onLanguageChange={select}>
      {/* Top Banner / Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
              <span className="size-2 animate-ping rounded-full bg-primary" />
              AI Voice Assistant
            </span>
            <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-ink">
              Bidirectional · Voice + Text
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            आवाज़ सहायक (AI Voice Assistant)
          </h1>
          <p className="mt-1 text-sm font-medium text-inksoft">
            Translate between Hindi and all 3 tribal languages (Santali, Ho & Mundari) with
            real-time speech readout and detailed text below.
          </p>
        </div>

        {/* Speech Rate Control */}
        <div className="flex items-center gap-2 rounded-2xl bg-card p-2 shadow-card">
          <span className="text-xs font-extrabold text-inksoft">Voice speed:</span>
          <button
            onClick={() => setSpeechRate(0.75)}
            className={`pill px-3 py-1 text-xs font-extrabold transition-all ${
              speechRate === 0.75 ? "bg-primary text-primary-foreground" : "bg-cream text-ink"
            }`}
          >
            🐢 0.75x (Learner)
          </button>
          <button
            onClick={() => setSpeechRate(0.95)}
            className={`pill px-3 py-1 text-xs font-extrabold transition-all ${
              speechRate >= 0.9 ? "bg-primary text-primary-foreground" : "bg-cream text-ink"
            }`}
          >
            🗣️ 1.0x (Normal)
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleSwitchMode("hi-to-all")}
          className={`pill min-h-12 px-6 text-sm font-black shadow-pop-sm transition-all ${
            mode === "hi-to-all"
              ? "bg-primary text-primary-foreground shadow-pop scale-[1.02]"
              : "bg-card text-ink hover:bg-cream"
          }`}
        >
          🇮🇳 Hindi ➔ All 3 Tribal Languages (Santali, Ho & Mundari)
        </button>
        <button
          onClick={() => handleSwitchMode("tribal-to-hi")}
          className={`pill min-h-12 px-6 text-sm font-black shadow-pop-sm transition-all ${
            mode === "tribal-to-hi"
              ? "bg-primary text-primary-foreground shadow-pop scale-[1.02]"
              : "bg-card text-ink hover:bg-cream"
          }`}
        >
          🌿 Tribal ➔ Hindi (Santali / Ho / Mundari to Hindi)
        </button>
      </div>

      {/* Assistant Interactive Stage & Controls */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: Assistant Voice & Input Module */}
        <div className="rounded-[2.5rem] bg-card p-6 shadow-card">
          <div className="flex flex-col items-center justify-center rounded-[2rem] bg-gradient-to-b from-cream to-butter/30 p-6 text-center">
            {/* Assistant Animated Orb / Avatar */}
            <div className="relative my-2 flex items-center justify-center">
              {/* Outer wave rings when listening or speaking */}
              {(listening || activeSpeechLang) && (
                <>
                  <span className="absolute size-36 animate-ping rounded-full bg-primary/20" />
                  <span className="absolute size-28 animate-pulse rounded-full bg-sky/30" />
                </>
              )}
              <div
                className={`relative grid size-24 place-items-center rounded-full text-4xl shadow-pop transition-transform duration-300 ${
                  listening
                    ? "bg-rose-500 text-white scale-110"
                    : activeSpeechLang
                      ? "bg-leaf text-white animate-bounce"
                      : "bg-primary text-primary-foreground"
                }`}
              >
                {listening ? "🎙️" : activeSpeechLang ? "🔊" : "🤖"}
              </div>
            </div>

            {/* Live Assistant Status */}
            <div className="mt-3">
              <span className="inline-block rounded-full bg-card px-4 py-1 text-xs font-black tracking-wide text-ink uppercase shadow-pop-sm">
                {listening
                  ? "Listening… speak your sentence"
                  : activeSpeechLang
                    ? `Reading out aloud: ${activeSpeechLang}`
                    : mode === "hi-to-all"
                      ? "Hindi ➔ Santali, Ho & Mundari Ready"
                      : "Tribal ➔ Hindi Ready"}
              </span>
            </div>

            {micError && (
              <p className="mt-3 max-w-md text-center text-xs font-bold text-red-600">{micError}</p>
            )}

            {/* Quick Action Buttons for Mic & Read All */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={listening ? stopVoiceListening : startVoiceListening}
                className={`pill min-h-12 px-6 text-sm font-black shadow-pop transition-all ${
                  listening
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-ink text-cream hover:bg-ink/90"
                }`}
              >
                {listening ? "⏹️ Stop Listening" : "🎙️ Tap to Speak (Voice Input)"}
              </button>

              <button
                onClick={handleReadOutAll}
                className="pill min-h-12 bg-aqua text-ink font-black shadow-pop hover:brightness-105"
              >
                🔊 Read Out All Sentences
              </button>

              {activeSpeechLang && (
                <button
                  onClick={() => {
                    stopSpeaking();
                    setActiveSpeechLang(null);
                  }}
                  className="pill min-h-12 bg-rose-100 text-rose-800 text-xs font-black shadow-pop-sm"
                >
                  ⏹️ Stop Audio
                </button>
              )}
            </div>
          </div>

          {/* Sub-selector for Tribal -> Hindi language mode */}
          {mode === "tribal-to-hi" && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-cream p-3">
              <span className="text-xs font-extrabold text-inksoft">Source Dialect:</span>
              {(["auto", "santhali", "ho", "mundari"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setSelectedTribalSource(l);
                    handleTranslate();
                  }}
                  className={`pill px-3 py-1 text-xs font-extrabold ${
                    selectedTribalSource === l
                      ? "bg-primary text-primary-foreground shadow-pop-sm"
                      : "bg-card text-ink"
                  }`}
                >
                  {l === "auto"
                    ? "✨ Auto-detect"
                    : l === "santhali"
                      ? "Santali (ᱥᱟᱱᱛᱟᱲᱤ)"
                      : l === "ho"
                        ? "Ho (हो)"
                        : "Mundari (मुंडारी)"}
                </button>
              ))}
            </div>
          )}

          {/* Text Input Box */}
          <div className="mt-4">
            <label className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
              {mode === "hi-to-all"
                ? "Sentence to translate (Hindi) · हिंदी वाक्य"
                : "Sentence to translate (Tribal) · Santali / Ho / Mundari"}
            </label>
            <div className="relative mt-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleTranslate();
                  }
                }}
                rows={3}
                placeholder={
                  mode === "hi-to-all"
                    ? "यहाँ हिंदी में वाक्य लिखें या बोलें (जैसे: एक से दस तक गिनो)..."
                    : "Enter Santali, Ho, or Mundari sentence (Latin or Ol Chiki)..."
                }
                className="w-full resize-none rounded-2xl bg-cream p-4 text-base font-bold text-ink outline-none ring-2 ring-transparent transition focus:ring-primary"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTranslate()}
                    className="pill bg-primary px-5 py-2 text-sm font-black text-primary-foreground shadow-pop hover:brightness-105"
                  >
                    Translate
                  </button>
                  <button
                    onClick={() =>
                      handleSpeakSingle(
                        inputText,
                        mode === "hi-to-all" ? "hi-IN" : "hi-IN",
                        "Input Sentence",
                      )
                    }
                    className="pill bg-card px-4 py-2 text-xs font-extrabold text-ink shadow-pop-sm hover:bg-cream"
                  >
                    ▶ Hear Input
                  </button>
                </div>
                {inputText && (
                  <button
                    onClick={() => setInputText("")}
                    className="text-xs font-bold text-inksoft hover:text-ink"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Classroom Prompts */}
          <div className="mt-5">
            <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
              💡 Quick classroom examples (Tap to test & hear):
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {mode === "hi-to-all"
                ? PRESET_HINDI_PROMPTS.map((p) => (
                    <button
                      key={p.text}
                      onClick={() => {
                        setInputText(p.text);
                        handleTranslate(p.text);
                      }}
                      className="pill min-h-9 bg-butter/70 px-3 text-xs font-bold text-ink shadow-pop-sm hover:bg-butter"
                    >
                      {p.label}
                    </button>
                  ))
                : PRESET_TRIBAL_PROMPTS.map((p) => (
                    <button
                      key={p.text}
                      onClick={() => {
                        setInputText(p.text);
                        setSelectedTribalSource(p.lang || "auto");
                        const res = translateTribalToHindi(p.text, p.lang);
                        setTribalResult(res);
                        setHiToAllResult(null);
                      }}
                      className="pill min-h-9 bg-mint/70 px-3 text-xs font-bold text-ink shadow-pop-sm hover:bg-mint"
                    >
                      {p.label}
                    </button>
                  ))}
            </div>
          </div>
        </div>

        {/* Right: History & Classroom Dialogue Log */}
        <div className="rounded-[2.5rem] bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold">Recent Voice Exchanges</h3>
            <span className="rounded-full bg-sky px-2.5 py-0.5 text-[10px] font-extrabold text-ink">
              {history.length} items
            </span>
          </div>

          <div className="mt-4 space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setInputText(item.source);
                  if (item.mode === "hi-to-all") {
                    setMode("hi-to-all");
                    handleTranslate(item.source);
                  } else {
                    setMode("tribal-to-hi");
                    const res = translateTribalToHindi(item.source);
                    setTribalResult(res);
                    setHiToAllResult(null);
                  }
                }}
                className="cursor-pointer rounded-2xl bg-cream p-3 text-left transition hover:bg-butter/50"
              >
                <div className="flex items-center justify-between text-[10px] font-black text-inksoft uppercase">
                  <span>{item.sourceLangLabel}</span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm font-bold text-ink">{item.source}</p>
                <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-primary">
                  {item.targetSummary}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-mint/40 p-3 text-xs font-bold text-inksoft">
            ✨ Tip: Tap any past phrase above to reload and hear it translated across all languages.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GENERATED TEXT OF THE TRANSLATION (RENDERED BELOW) */}
      {/* ========================================================================= */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <span className="text-xs font-extrabold tracking-[0.16em] text-inksoft uppercase">
              Generated Translation Text
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {mode === "hi-to-all"
                ? "Translations in All 3 Languages (Santali, Ho & Mundari)"
                : "Hindi Translation Output"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-mint px-3 py-1 text-xs font-black text-leaf">
              ✓ Context-Aware Synthesized
            </span>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CASE A: Hindi to All 3 Target Languages */}
        {/* ----------------------------------------------------------------------- */}
        {mode === "hi-to-all" && hiToAllResult && (
          <div className="mt-6 space-y-6">
            {/* The 3 Cards: Santali, Ho, Mundari */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Card 1: Santali */}
              <div
                className={`flex flex-col justify-between rounded-[2rem] bg-card p-5 shadow-card transition-all ${
                  activeSpeechLang === "Santali" ? "ring-4 ring-primary scale-[1.01]" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blush px-3 py-1 text-xs font-black text-ink">
                      Santali · ᱥᱟᱱᱛᱟᱲᱤ
                    </span>
                    <span className="text-[11px] font-bold text-inksoft">Ol Chiki Script</span>
                  </div>

                  {/* Authentic Ol Chiki Typography */}
                  <div className="mt-4 rounded-2xl bg-cream p-4">
                    <p className="text-xs font-extrabold text-inksoft uppercase">Ol Chiki</p>
                    <p className="mt-1 font-serif text-2xl font-bold text-ink leading-relaxed">
                      {hiToAllResult.santali.olChiki || "—"}
                    </p>
                  </div>

                  {/* Latin Transliteration */}
                  <div className="mt-3">
                    <p className="text-[11px] font-extrabold text-inksoft uppercase">
                      Latin Pronunciation
                    </p>
                    <p className="mt-0.5 text-base font-bold text-primary">
                      {hiToAllResult.santali.latin}
                    </p>
                  </div>

                  {/* Devanagari guide */}
                  <div className="mt-2 text-xs font-semibold text-inksoft">
                    <span className="font-bold">Devanagari:</span>{" "}
                    {hiToAllResult.santali.devanagari}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
                  <button
                    onClick={() =>
                      handleSpeakSingle(hiToAllResult.santali.latin, "hi-IN", "Santali")
                    }
                    className={`pill min-h-10 px-4 text-xs font-black shadow-pop-sm transition ${
                      activeSpeechLang === "Santali"
                        ? "bg-leaf text-white"
                        : "bg-ink text-cream hover:bg-ink/90"
                    }`}
                  >
                    {activeSpeechLang === "Santali" ? "🔊 Playing…" : "▶ Read Santali"}
                  </button>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${hiToAllResult.santali.latin} (${hiToAllResult.santali.olChiki})`,
                        "santali",
                      )
                    }
                    className="pill bg-card px-3 py-1.5 text-xs font-bold text-ink shadow-pop-sm hover:bg-cream"
                  >
                    {copiedKey === "santali" ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
              </div>

              {/* Card 2: Ho */}
              <div
                className={`flex flex-col justify-between rounded-[2rem] bg-card p-5 shadow-card transition-all ${
                  activeSpeechLang === "Ho" ? "ring-4 ring-primary scale-[1.01]" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-butter px-3 py-1 text-xs font-black text-ink">
                      Ho · हो / 𑢹𑣉
                    </span>
                    <span className="text-[11px] font-bold text-inksoft">Warang Chiti / Latin</span>
                  </div>

                  {/* Ho Latin Text */}
                  <div className="mt-4 rounded-2xl bg-cream p-4">
                    <p className="text-xs font-extrabold text-inksoft uppercase">Sentence</p>
                    <p className="mt-1 text-xl font-bold text-ink leading-relaxed">
                      {hiToAllResult.ho.latin || "—"}
                    </p>
                  </div>

                  {/* Devanagari guide */}
                  <div className="mt-3">
                    <p className="text-[11px] font-extrabold text-inksoft uppercase">
                      Devanagari Transliteration
                    </p>
                    <p className="mt-0.5 text-base font-bold text-primary">
                      {hiToAllResult.ho.devanagari}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
                  <button
                    onClick={() => handleSpeakSingle(hiToAllResult.ho.latin, "hi-IN", "Ho")}
                    className={`pill min-h-10 px-4 text-xs font-black shadow-pop-sm transition ${
                      activeSpeechLang === "Ho"
                        ? "bg-leaf text-white"
                        : "bg-ink text-cream hover:bg-ink/90"
                    }`}
                  >
                    {activeSpeechLang === "Ho" ? "🔊 Playing…" : "▶ Read Ho"}
                  </button>

                  <button
                    onClick={() => copyToClipboard(hiToAllResult.ho.latin, "ho")}
                    className="pill bg-card px-3 py-1.5 text-xs font-bold text-ink shadow-pop-sm hover:bg-cream"
                  >
                    {copiedKey === "ho" ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
              </div>

              {/* Card 3: Mundari */}
              <div
                className={`flex flex-col justify-between rounded-[2rem] bg-card p-5 shadow-card transition-all ${
                  activeSpeechLang === "Mundari" ? "ring-4 ring-primary scale-[1.01]" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-sky px-3 py-1 text-xs font-black text-ink">
                      Mundari · मुंडारी
                    </span>
                    <span className="text-[11px] font-bold text-inksoft">Mundari Bani / Latin</span>
                  </div>

                  {/* Mundari Latin Text */}
                  <div className="mt-4 rounded-2xl bg-cream p-4">
                    <p className="text-xs font-extrabold text-inksoft uppercase">Sentence</p>
                    <p className="mt-1 text-xl font-bold text-ink leading-relaxed">
                      {hiToAllResult.mundari.latin || "—"}
                    </p>
                  </div>

                  {/* Devanagari guide */}
                  <div className="mt-3">
                    <p className="text-[11px] font-extrabold text-inksoft uppercase">
                      Devanagari Transliteration
                    </p>
                    <p className="mt-0.5 text-base font-bold text-primary">
                      {hiToAllResult.mundari.devanagari}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
                  <button
                    onClick={() =>
                      handleSpeakSingle(hiToAllResult.mundari.latin, "hi-IN", "Mundari")
                    }
                    className={`pill min-h-10 px-4 text-xs font-black shadow-pop-sm transition ${
                      activeSpeechLang === "Mundari"
                        ? "bg-leaf text-white"
                        : "bg-ink text-cream hover:bg-ink/90"
                    }`}
                  >
                    {activeSpeechLang === "Mundari" ? "🔊 Playing…" : "▶ Read Mundari"}
                  </button>

                  <button
                    onClick={() => copyToClipboard(hiToAllResult.mundari.latin, "mundari")}
                    className="pill bg-card px-3 py-1.5 text-xs font-bold text-ink shadow-pop-sm hover:bg-cream"
                  >
                    {copiedKey === "mundari" ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
              </div>
            </div>

            {/* Blackboard Word-by-Word Alignment Grid */}
            {hiToAllResult.breakdown && hiToAllResult.breakdown.length > 0 && (
              <div className="rounded-[2rem] bg-card p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">
                    Classroom Blackboard Word Mapping
                  </h3>
                  <span className="text-xs font-extrabold text-inksoft">
                    NIPUN Bharat Pedagogical Bridge
                  </span>
                </div>
                <p className="mt-1 text-xs text-inksoft">
                  Word-by-word structural alignment to teach vocabulary on the blackboard.
                </p>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-[11px] font-black text-inksoft uppercase">
                        <th className="pb-2">Hindi (हिंदी)</th>
                        <th className="pb-2">Santali (ᱥᱟᱱᱛᱟᱲᱤ)</th>
                        <th className="pb-2">Ho (हो)</th>
                        <th className="pb-2">Mundari (मुंडारी)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {hiToAllResult.breakdown.map((row, idx) => (
                        <tr key={idx} className="hover:bg-cream/50 transition">
                          <td className="py-2.5 font-bold text-ink">{row.source}</td>
                          <td className="py-2.5 font-bold text-primary">{row.santali}</td>
                          <td className="py-2.5 font-medium text-ink">{row.ho}</td>
                          <td className="py-2.5 font-medium text-ink">{row.mundari}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* CASE B: Tribal to Hindi Output */}
        {/* ----------------------------------------------------------------------- */}
        {mode === "tribal-to-hi" && tribalResult && (
          <div className="mt-6 space-y-6">
            <div className="rounded-[2.5rem] bg-card p-6 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-leaf/20 px-3 py-1 text-xs font-black text-leaf">
                  Detected: {tribalResult.detectedLangName} ➔ Hindi
                </span>
                <span className="text-xs font-bold text-inksoft">
                  Confidence: {Math.round(tribalResult.confidence * 100)}%
                </span>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {/* Source Tribal Card */}
                <div className="rounded-2xl bg-cream p-4">
                  <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
                    Tribal Input ({tribalResult.detectedLangName})
                  </p>
                  <p className="mt-2 text-xl font-bold text-ink">{tribalResult.sourceText}</p>
                  <button
                    onClick={() =>
                      handleSpeakSingle(
                        tribalResult.latin || tribalResult.sourceText,
                        "hi-IN",
                        tribalResult.detectedLangName,
                      )
                    }
                    className="mt-4 pill min-h-9 bg-card px-4 text-xs font-black text-ink shadow-pop-sm hover:bg-butter"
                  >
                    ▶ Hear {tribalResult.detectedLangName}
                  </button>
                </div>

                {/* Generated Hindi Output Card */}
                <div className="rounded-2xl bg-mint/40 p-4">
                  <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
                    Hindi Output (हिंदी अनुवाद)
                  </p>
                  <p className="mt-2 text-2xl font-black text-ink leading-relaxed">
                    {tribalResult.hindi || "—"}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleSpeakSingle(tribalResult.hindi, "hi-IN", "Hindi")}
                      className={`pill min-h-10 px-5 text-xs font-black shadow-pop transition ${
                        activeSpeechLang === "Hindi"
                          ? "bg-leaf text-white"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {activeSpeechLang === "Hindi" ? "🔊 Playing…" : "▶ Read Hindi Audio"}
                    </button>
                    <button
                      onClick={() => copyToClipboard(tribalResult.hindi, "hindi-out")}
                      className="pill bg-card px-4 py-2 text-xs font-bold text-ink shadow-pop-sm hover:bg-cream"
                    >
                      {copiedKey === "hindi-out" ? "✓ Copied" : "📋 Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Word breakdown for Tribal -> Hindi */}
              {tribalResult.breakdown && tribalResult.breakdown.length > 0 && (
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-xs font-extrabold text-inksoft uppercase">Word Matches:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tribalResult.breakdown.map((b, i) => (
                      <div key={i} className="rounded-xl bg-cream px-3 py-1.5 text-xs">
                        <span className="font-bold text-primary">{b.tribal}</span> ➔{" "}
                        <span className="font-extrabold text-ink">{b.hindi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
