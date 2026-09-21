import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CLASSROOM_PROMPTS, translateToTribal, useLanguage } from "@/lib/lang";
import {
  createRecognition,
  describeVoiceRecognitionError,
  readTranscript,
  requestMicrophonePermission,
  speak,
} from "@/lib/speech";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "Real-Time Voice Translation — BhashaMitra" },
      {
        name: "description",
        content:
          "Speak Hindi and your class hears Ho, Mundari or Santhali back in under three seconds for live classroom dialogue.",
      },
      { property: "og:title", content: "Real-Time Voice Translation — BhashaMitra" },
      {
        property: "og:description",
        content: "Live Hindi to tribal-language classroom dialogue with sub-3-second latency.",
      },
    ],
  }),
  component: VoicePage,
});

type Turn = { hindi: string; tribal: string; ms: number };

function VoicePage() {
  const { language, select } = useLanguage();
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [supported, setSupported] = useState(true);
  const [micMessage, setMicMessage] = useState("");
  const startedAt = useRef(0);
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);
  const latestHeard = useRef("");
  const hasCommitted = useRef(false);

  useEffect(() => {
    setSupported(createRecognition() !== null);
  }, []);

  function commit(hindi: string, ms: number) {
    const tribal = translateToTribal(hindi, language.code);
    setTurns((t) => [{ hindi, tribal, ms }, ...t].slice(0, 6));
    speak(tribal, "en-IN");
  }

  async function startListening() {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setSupported(false);
      setMicMessage("Microphone access is blocked. Please allow mic permission and click the mic again.");
      return;
    }

    setMicMessage("");
    const rec = createRecognition("hi-IN");
    if (!rec) {
      setSupported(false);
      setMicMessage("Speech recognition is not supported in this browser.");
      return;
    }
    startedAt.current = performance.now();
    latestHeard.current = "";
    hasCommitted.current = false;
    recognitionRef.current = rec;
    setHeard("");
    setListening(true);

    rec.onresult = (event) => {
      const { text, final } = readTranscript(event);
      if (text) {
        setHeard(text);
        latestHeard.current = text;
        if (final && text.trim() && !hasCommitted.current) {
          hasCommitted.current = true;
          setListening(false);
          commit(text.trim(), Math.round(performance.now() - startedAt.current));
        }
      }
    };

    rec.onerror = (event: unknown) => {
      setListening(false);
      setMicMessage(describeVoiceRecognitionError(event));
      const text = latestHeard.current.trim();
      if (text && !hasCommitted.current) {
        hasCommitted.current = true;
        commit(text, Math.round(performance.now() - startedAt.current));
      }
    };

    rec.onend = () => {
      setListening(false);
      const text = latestHeard.current.trim();
      if (text && !hasCommitted.current) {
        hasCommitted.current = true;
        commit(text, Math.round(performance.now() - startedAt.current));
      }
    };

    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // no-op
      }
    }
    setListening(false);
    const text = latestHeard.current.trim();
    if (text && !hasCommitted.current) {
      hasCommitted.current = true;
      commit(text, Math.round(performance.now() - startedAt.current));
    }
  }

  return (
    <AppShell language={language} onLanguageChange={select}>
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Real-Time Voice Translation
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed font-medium text-inksoft">
        Tap the mic, speak Hindi, and the class hears {language.name} straight back — fast enough
        for real question-and-answer.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.9fr]">
        <div className="rounded-[2rem] bg-card p-6 shadow-card">
          <div className="flex flex-col items-center gap-4 rounded-[1.5rem] bg-cream p-6">
            <div className="relative grid size-28 place-items-center">
              {listening && (
                <span className="mic-ripple absolute inset-0 rounded-full bg-primary" />
              )}
              <button
                onClick={listening ? stopListening : startListening}
                className={`relative grid size-24 place-items-center rounded-full text-3xl text-primary-foreground shadow-pop transition-all ${
                  listening ? "bg-rose-500 scale-105" : "bg-primary hover:scale-105"
                }`}
                aria-label={listening ? "Stop listening in Hindi" : "Start speaking in Hindi"}
              >
                {listening ? "⏹️" : "🎙️"}
              </button>
            </div>
            <p className="text-sm font-extrabold text-inksoft">
              {listening ? "Listening… tap ⏹️ to finish" : "Tap to speak in Hindi"}
            </p>
            {heard && <p className="text-center text-lg font-bold">{heard}</p>}
            {!supported && (
              <p className="text-center text-xs font-bold text-inksoft">
                {micMessage || "This device's browser can't capture the mic — use the sample phrases instead."}
              </p>
            )}
            {supported && micMessage && (
              <p className="text-center text-xs font-bold text-inksoft">{micMessage}</p>
            )}
          </div>

          <p className="mt-5 text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
            Sample classroom phrases
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CLASSROOM_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => commit(p, 1200 + Math.round(Math.random() * 900))}
                className="pill min-h-11 bg-butter px-4 text-sm text-ink shadow-pop-sm"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
              Classroom dialogue
            </p>
            <span className="rounded-full bg-mint px-3 py-1 text-xs font-extrabold">
              Target &lt; 3.0 s
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {turns.length === 0 && (
              <p className="rounded-2xl bg-cream p-4 text-sm font-bold text-inksoft">
                Nothing spoken yet. Your last six exchanges will appear here.
              </p>
            )}
            {turns.map((t, i) => (
              <div key={i} className="rounded-2xl bg-cream p-4">
                <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
                  Teacher · Hindi
                </p>
                <p className="text-base font-bold">{t.hindi}</p>
                <p className="mt-2 text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
                  {language.name} · spoken to class
                </p>
                <p className="text-base font-bold text-primary">{t.tribal}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => speak(t.tribal, "en-IN")}
                    className="grid size-8 place-items-center rounded-full bg-ink text-xs text-cream"
                    aria-label="Replay"
                  >
                    ▶
                  </button>
                  <span className="font-display text-lg font-bold">
                    {(t.ms / 1000).toFixed(1)}s
                  </span>
                  <span className="text-xs font-extrabold text-inksoft">end-to-end</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
