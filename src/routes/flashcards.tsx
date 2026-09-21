import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LANGUAGES, OUTCOMES, translateToTribal, useLanguage, type LangCode } from "@/lib/lang";
import { speak } from "@/lib/speech";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Picture Flashcards — BhashaMitra" },
      {
        name: "description",
        content:
          "Picture-based Hindi and tribal-language flashcards with audio for classroom practice.",
      },
    ],
  }),
  component: FlashcardsPage,
});

const TINTS = ["bg-butter", "bg-sky", "bg-blush", "bg-mint"];
type FlashcardLanguage = "hindi" | LangCode;

function speechLocaleFor(languageCode: "ho" | "mundari" | "santhali") {
  return languageCode === "mundari" ? "hi-IN" : "en-IN";
}

function FlashcardsPage() {
  const { language, select } = useLanguage();
  const [outcomeId, setOutcomeId] = useState(OUTCOMES[0]!.id);
  const [flashcardLanguage, setFlashcardLanguage] = useState<FlashcardLanguage>(language.code);
  const outcome = OUTCOMES.find((item) => item.id === outcomeId) ?? OUTCOMES[0]!;
  const cards = useMemo(
    () =>
      outcome.items.map((item) => ({
        ...item,
        display:
          flashcardLanguage === "hindi" ? item.hi : translateToTribal(item.hi, flashcardLanguage),
      })),
    [outcome, flashcardLanguage],
  );

  useEffect(() => {
    setFlashcardLanguage(language.code);
  }, [language.code]);

  const displayLanguageName =
    flashcardLanguage === "hindi"
      ? "Hindi"
      : (LANGUAGES.find((item) => item.code === flashcardLanguage)?.name ?? language.name);

  return (
    <AppShell language={language} onLanguageChange={select}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold tracking-[0.18em] text-inksoft uppercase">
            Picture learning
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            Picture flashcards
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed font-medium text-inksoft">
            Choose Hindi or a mother-tongue language, then tap the displayed word to hear it aloud.
          </p>
        </div>
        <span className="rounded-2xl bg-mint px-4 py-3 text-sm font-extrabold text-ink shadow-pop-sm">
          {cards.length} picture cards
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFlashcardLanguage("hindi")}
          aria-pressed={flashcardLanguage === "hindi"}
          className={[
            "pill min-h-11 px-5 text-sm",
            flashcardLanguage === "hindi"
              ? "bg-ink text-cream shadow-pop"
              : "bg-card text-ink shadow-pop-sm",
          ].join(" ")}
        >
          Hindi
        </button>
        {LANGUAGES.map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => {
              select(item.code);
              setFlashcardLanguage(item.code);
            }}
            aria-pressed={item.code === flashcardLanguage}
            className={[
              "pill min-h-11 px-5 text-sm",
              item.code === flashcardLanguage
                ? "bg-ink text-cream shadow-pop"
                : "bg-card text-ink shadow-pop-sm",
            ].join(" ")}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {OUTCOMES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOutcomeId(item.id)}
            aria-pressed={item.id === outcomeId}
            className={[
              "pill min-h-11 px-5 text-sm",
              item.id === outcomeId
                ? "bg-ink text-cream shadow-pop"
                : "bg-card text-ink shadow-pop-sm",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="mt-6 rounded-[2rem] bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-extrabold tracking-wide text-inksoft uppercase">
              Picture set
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold">
              {outcome.hindiTopic} · {displayLanguageName}
            </h2>
          </div>
          <p className="rounded-full bg-sky px-3 py-1 text-xs font-extrabold">Tap to hear</p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <article
              key={card.hi}
              className={`group min-h-72 rounded-[1.75rem] p-5 text-center shadow-pop-sm transition-transform hover:-translate-y-1 ${TINTS[index % TINTS.length]}`}
            >
              <span className="block text-7xl leading-none transition-transform group-hover:scale-110">
                {card.emoji}
              </span>
              <p className="mt-6 text-[10px] font-extrabold tracking-[0.16em] text-inksoft uppercase">
                {displayLanguageName} word
              </p>
              <p className="mt-1 font-display text-3xl font-semibold">{card.display}</p>
              <div className="mt-4 grid gap-2">
                {flashcardLanguage === "hindi" ? (
                  <button
                    type="button"
                    onClick={() => speak(card.hi, "hi-IN")}
                    className="rounded-xl bg-ink px-3 py-2 text-sm font-extrabold text-cream transition hover:bg-ink/90"
                  >
                    🔊 Hindi: {card.hi}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => speak(card.hi, "hi-IN")}
                      className="rounded-xl bg-white/80 px-3 py-2 text-sm font-extrabold text-ink transition hover:bg-white"
                    >
                      🔊 Hindi: {card.hi}
                    </button>
                    <button
                      type="button"
                      onClick={() => speak(card.display, speechLocaleFor(flashcardLanguage))}
                      className="rounded-xl bg-ink px-3 py-2 text-sm font-extrabold text-cream transition hover:bg-ink/90"
                    >
                      🔊 {displayLanguageName}: {card.display}
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
