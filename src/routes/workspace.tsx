import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, LanguagePicker } from "@/components/AppShell";
import { useLanguage, LANGUAGES } from "@/lib/lang";
import { Bot, FileText, Mic, FolderKanban, HardDrive, CheckCircle2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Vernacular Workspace — Academia–Industry Collaboration" },
      {
        name: "description",
        content:
          "Select Ho, Mundari, or Santhali to launch curriculum translation, live voice translation, or learning materials generation.",
      },
    ],
  }),
  component: Workspace,
});

const FEATURES = [
  {
    to: "/assistant",
    icon: Bot,
    iconColor: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    title: "AI Voice Assistant",
    body: "Bidirectional voice assistant for Hindi ↔ Santali, Ho & Mundari with voice readout and generated text.",
    note: "All 3 languages · Voice + Text",
  },
  {
    to: "/translate",
    icon: FileText,
    iconColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    title: "Curriculum Translation",
    body: "Turn Hindi FLN lesson scripts, activity steps, and assessment prompts into context-aware text plus audio.",
    note: "142 lessons stored on device",
  },
  {
    to: "/voice",
    icon: Mic,
    iconColor: "text-pink-600 dark:text-pink-400 bg-pink-500/10",
    title: "Real-Time Voice",
    body: "Speak Hindi and the class hears their own language back — live dialogue in under three seconds.",
    note: "Sub-3 second latency",
  },
  {
    to: "/materials",
    icon: FolderKanban,
    iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    title: "Learning Material",
    body: "Auto-build bilingual worksheets and visual flashcards mapped to NIPUN Bharat outcomes.",
    note: "36 ready-made sets",
  },
] as const;

function Workspace() {
  const { language, select } = useLanguage();

  return (
    <AppShell language={language} onLanguageChange={select}>
      {/* Step 1 */}
      <section>
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            1
          </span>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Target Language Selection
          </p>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Select Target Vernacular Language
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Models and dictionary corpora are stored locally on-device for offline reliability.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => select(l.code)}
              aria-pressed={language.code === l.code}
              className={[
                "rounded-2xl border p-5 text-left transition-all duration-150",
                language.code === l.code
                  ? "border-primary bg-primary/10 text-foreground shadow-sm ring-1 ring-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-foreground">{l.name}</p>
                {language.code === l.code && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground shadow">
                    ✓
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-primary">{l.native}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {l.speakers} &bull; Pack size {l.pack}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Step 2 */}
      <section className="mt-10">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            2
          </span>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Application Feature
          </p>
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Select Classroom or Research Tool
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const IconComp = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
              >
                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${f.iconColor}`}
                >
                  <IconComp className="size-5" />
                </div>
                <h3 className="mt-3 text-base font-bold text-foreground group-hover:text-primary">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.body}</p>
                <div className="mt-4 mt-auto rounded-xl border border-border bg-background px-3 py-2 text-[11px] font-semibold text-muted-foreground">
                  {f.note}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Offline sync & storage card */}
      <section className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <div className="flex items-center gap-2.5">
            <HardDrive className="size-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Local Storage & Offline Language Packs
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            Offline Synchronized
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {LANGUAGES.map((l, i) => (
            <div key={l.code} className="rounded-xl border border-border bg-background p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">
                  {l.name} Pack ({l.pack})
                </span>
                <span
                  className={
                    i === 2
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }
                >
                  {i === 2 ? "Syncing 62%" : "Ready"}
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    i === 2 ? "w-[62%] bg-amber-500" : "w-full bg-emerald-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <p>Local Storage Usage: 141 MB of 8 GB allocated tablet cache</p>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Active Target:</span>
            <LanguagePicker value={language.code} onChange={select} size="sm" />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
