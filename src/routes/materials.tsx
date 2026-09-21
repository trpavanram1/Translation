import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OUTCOMES, translateToTribal, useLanguage } from "@/lib/lang";
import { speak } from "@/lib/speech";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Worksheet & Flashcard Generator — BhashaMitra" },
      {
        name: "description",
        content:
          "Auto-generate bilingual Hindi–tribal worksheets and visual flashcards aligned to NIPUN Bharat learning outcomes.",
      },
      { property: "og:title", content: "Worksheet & Flashcard Generator — BhashaMitra" },
      {
        property: "og:description",
        content:
          "Bilingual worksheets and flashcards for NIPUN Bharat outcomes, generated on device.",
      },
    ],
  }),
  component: MaterialsPage,
});

function normalizeAnswer(value: string) {
  return value
    .trim()
    .replace(/[।?!,]+$/g, "")
    .replace(/\s+/g, " ");
}

function MaterialsPage() {
  const { language, select } = useLanguage();
  const [outcomeId, setOutcomeId] = useState(OUTCOMES[0]!.id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const outcome = OUTCOMES.find((o) => o.id === outcomeId) ?? OUTCOMES[0]!;
  const cards = useMemo(
    () => outcome.items.map((i) => ({ ...i, tribal: translateToTribal(i.hi, language.code) })),
    [outcome, language.code],
  );
  const score = checked
    ? cards.reduce(
        (total, card) =>
          total + (normalizeAnswer(answers[card.hi] ?? "") === normalizeAnswer(card.hi) ? 1 : 0),
        0,
      )
    : 0;

  useEffect(() => {
    setAnswers({});
    setChecked(false);
  }, [outcomeId]);

  function updateAnswer(answer: string, question: string) {
    setAnswers((current) => ({ ...current, [question]: answer }));
    setChecked(false);
  }

  return (
    <AppShell language={language} onLanguageChange={select}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Learning Material Generation
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed font-medium text-inksoft">
            Pick a NIPUN Bharat learning outcome and get a bilingual worksheet plus a visual
            flashcard set in Hindi and {language.name}.
          </p>
        </div>
        <div
          className="rounded-2xl bg-ink px-5 py-3 text-right text-cream shadow-pop"
          aria-live="polite"
        >
          <p className="text-[10px] font-extrabold tracking-[0.16em] uppercase">Final marks</p>
          <p className="font-display text-2xl font-bold">
            {score} / {cards.length}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {OUTCOMES.map((o) => (
          <button
            key={o.id}
            onClick={() => setOutcomeId(o.id)}
            aria-pressed={o.id === outcomeId}
            className={[
              "pill min-h-11 px-5 text-sm",
              o.id === outcomeId
                ? "bg-ink text-cream shadow-pop"
                : "bg-card text-ink shadow-pop-sm",
            ].join(" ")}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <div className="rounded-[2rem] bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
              Bilingual worksheet
            </p>
            <span className="rounded-full bg-sky px-3 py-1 text-xs font-extrabold">
              {outcome.label}
            </span>
          </div>
          <p className="mt-3 font-display text-xl font-semibold">
            {outcome.hindiTopic} · {translateToTribal(outcome.hindiTopic, language.code)}
          </p>
          <ol className="mt-4 space-y-3">
            {cards.map((c, i) => (
              <li key={c.hi} className="rounded-2xl bg-cream p-4">
                <p className="text-xs font-extrabold text-inksoft">प्रश्न {i + 1}</p>
                <p className="mt-1 text-base font-bold">{c.emoji} इस चित्र का नाम हिंदी में लिखो</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <input
                    value={answers[c.hi] ?? ""}
                    onChange={(event) => updateAnswer(event.target.value, c.hi)}
                    placeholder="हिंदी में उत्तर लिखें"
                    aria-label={`प्रश्न ${i + 1} का हिंदी उत्तर`}
                    className="min-h-11 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 py-2 text-base font-bold outline-none transition focus:border-primary"
                  />
                  {checked ? (
                    <span
                      className={[
                        "rounded-full px-3 py-2 text-xs font-extrabold",
                        normalizeAnswer(answers[c.hi] ?? "") === normalizeAnswer(c.hi)
                          ? "bg-mint text-ink"
                          : "bg-blush text-ink",
                      ].join(" ")}
                    >
                      {normalizeAnswer(answers[c.hi] ?? "") === normalizeAnswer(c.hi)
                        ? "1 mark"
                        : "0 marks"}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm font-bold text-primary">
                  {language.name}: {c.tribal}
                </p>
              </li>
            ))}
          </ol>
          <button
            onClick={() => setChecked(true)}
            className="pill mt-5 w-full bg-leaf text-white shadow-pop"
          >
            Check answers and award marks
          </button>
          <button
            onClick={() => typeof window !== "undefined" && window.print()}
            className="pill mt-3 w-full bg-primary text-primary-foreground shadow-pop"
          >
            Print / save worksheet
          </button>
        </div>
        <Link
          to="/flashcards"
          className="mt-4 flex items-center justify-between rounded-[2rem] bg-butter p-5 shadow-pop-sm transition-transform hover:-translate-y-1"
        >
          <div>
            <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
              Picture flashcards
            </p>
            <p className="mt-1 font-display text-xl font-semibold">
              Practice every word with pictures and audio
            </p>
          </div>
          <span className="text-2xl" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </AppShell>
  );
}
