import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SAMPLE_LESSONS, translateToTribal, useLanguage } from "@/lib/lang";
import { speak, stopSpeaking } from "@/lib/speech";

export const Route = createFileRoute("/translate")({
  head: () => ({
    meta: [
      { title: "Curriculum Translation — BhashaMitra" },
      {
        name: "description",
        content:
          "Translate Hindi FLN lesson scripts, activity instructions and assessment prompts into Ho, Mundari or Santhali text and audio.",
      },
      { property: "og:title", content: "Curriculum Translation — BhashaMitra" },
      {
        property: "og:description",
        content: "Hindi FLN content becomes mother-tongue text and speech, offline.",
      },
    ],
  }),
  component: TranslatePage,
});

function TranslatePage() {
  const { language, select } = useLanguage();
  const [hindi, setHindi] = useState(SAMPLE_LESSONS[0]!.hindi);
  const [submitted, setSubmitted] = useState(SAMPLE_LESSONS[0]!.hindi);

  const output = useMemo(
    () => translateToTribal(submitted, language.code),
    [submitted, language.code],
  );

  return (
    <AppShell language={language} onLanguageChange={select}>
      <h1 className="font-display text-3xl font-bold tracking-tight">Curriculum Translation</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed font-medium text-inksoft">
        Paste any Hindi FLN lesson script, activity instruction or assessment prompt. The on-device
        engine returns context-aware {language.name} text you can play aloud in class.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-card p-5 shadow-card">
          <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
            Hindi input · हिंदी
          </p>
          <textarea
            value={hindi}
            onChange={(e) => setHindi(e.target.value)}
            rows={6}
            className="mt-3 w-full resize-none rounded-2xl bg-cream p-4 text-lg font-bold outline-none focus:ring-2 focus:ring-ring"
            placeholder="यहाँ हिंदी पाठ लिखें…"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setSubmitted(hindi)}
              className="pill bg-primary text-primary-foreground shadow-pop"
            >
              Translate
            </button>
            <button
              onClick={() => speak(hindi, "hi-IN")}
              className="pill bg-card text-ink shadow-pop-sm"
            >
              ▶ Hear Hindi
            </button>
          </div>

          <p className="mt-5 text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
            FLN lesson bank
          </p>
          <div className="mt-2 grid gap-2">
            {SAMPLE_LESSONS.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setHindi(l.hindi);
                  setSubmitted(l.hindi);
                }}
                className="rounded-2xl bg-cream p-3 text-left transition-transform active:translate-y-0.5"
              >
                <p className="text-sm font-extrabold">{l.title}</p>
                <p className="text-xs font-bold text-inksoft">{l.outcome}</p>
                <p className="mt-1 text-sm font-bold">{l.hindi}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
              {language.name} output
            </p>
            <span className="rounded-full bg-sky px-3 py-1 text-xs font-extrabold">
              Hindi → {language.name}
            </span>
          </div>
          <div className="mt-3 rounded-2xl bg-mint p-4">
            <p className="text-xl leading-relaxed font-bold">{output || "—"}</p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => speak(output, "en-IN")}
                aria-label="Play synthesised audio"
                className="grid size-11 place-items-center rounded-full bg-ink text-sm font-extrabold text-cream"
              >
                ▶
              </button>
              <div className="flex h-6 flex-1 items-end gap-0.5">
                {[2, 4, 6, 3, 5, 2, 4, 6, 3, 5, 4, 2, 6].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-full bg-leaf"
                    style={{ height: `${h * 4}px` }}
                  />
                ))}
              </div>
              <button onClick={stopSpeaking} className="text-xs font-extrabold text-inksoft">
                Stop
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-cream p-4">
            <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
              Side-by-side for the blackboard
            </p>
            <p className="mt-2 text-base font-bold">{submitted}</p>
            <p className="mt-1 text-base font-bold text-primary">{output}</p>
          </div>

          <p className="mt-4 text-xs font-bold text-inksoft">
            Saved to device · works with no internet
          </p>
        </div>
      </div>
    </AppShell>
  );
}
