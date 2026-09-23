import { createFileRoute, Link } from "@tanstack/react-router";
import { Brand, PortalBackdrop, LanguagePicker, OfflineChip } from "@/components/AppShell";
import { translateToTribal, useLanguage } from "@/lib/lang";
import { getCurrentUser } from "@/lib/auth";
import {
  ArrowRight,
  Sparkles,
  Bot,
  FileText,
  Mic,
  FolderKanban,
  CheckCircle2,
  LogIn,
  LayoutDashboard,
  Zap,
  Globe,
  Award,
  Video,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CODEX — A Better Learning Journey Future Starts Here" },
      {
        name: "description",
        content:
          "Vernacular AI pedagogy and Academia–Industry collaboration suite for mother-tongue primary education in Ho, Mundari, and Santhali.",
      },
      { property: "og:title", content: "CODEX — Vernacular Learning & Collaboration" },
      {
        name: "og:description",
        content:
          "Delivering real-time voice translation, curriculum generation, and offline classroom tools.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { language, select } = useLanguage();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const sample = "एक से दस तक गिनो।";

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <PortalBackdrop />

      {/* Top Header matching eduAct navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Brand size="md" />

          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
            <Link to="/" className="text-foreground transition hover:text-primary">
              Home
            </Link>
            <Link to="/workspace" className="transition hover:text-primary">
              Workspace
            </Link>
            <Link to="/assistant" className="transition hover:text-primary">
              AI Assistant
            </Link>
            <Link to="/translate" className="transition hover:text-primary">
              Curriculum
            </Link>
            <Link to="/voice" className="transition hover:text-primary">
              Live Voice
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <OfflineChip />
            </div>

            {currentUser ? (
              <Link
                to="/workspace"
                className="pill !min-h-9 !py-1.5 !px-4 !text-xs !shadow-[0_2px_12px_rgba(255,120,45,0.4)]"
              >
                <LayoutDashboard className="size-3.5" />
                <span>Workspace ({currentUser.role})</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold text-foreground transition hover:border-primary/50 hover:text-primary"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="pill !min-h-9 !py-1.5 !px-4 !text-xs !shadow-[0_2px_12px_rgba(255,120,45,0.4)]"
                >
                  <span>Get Started &rarr;</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section matching the eduAct composition */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff782d]/30 bg-[#ff782d]/10 px-4 py-1.5 text-xs font-bold text-[#ff8e4d]">
            <Sparkles className="size-3.5" />
            <span>AI-Powered Vernacular Pedagogy Suite</span>
          </div>

          {/* Big Headline */}
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.08]">
            A Better Learning Journey{" "}
            <span className="text-primary">
              Future Starts Here
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Empowering non-native primary school teachers and research partners to deliver mother-tongue 
            instruction in Ho, Mundari, and Santhali with real-time AI voice translation, bilingual curriculum worksheets, and 100% offline tablet operation.
          </p>

          {/* Dual Action CTA Buttons matching eduAct */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/login" search={{ redirect: "/workspace" }} className="pill">
              <span>Take Now</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/login" search={{ redirect: "/assistant" }} className="pill-secondary">
              <Bot className="size-4 text-primary" />
              <span>Explore Assistant &rarr;</span>
            </Link>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            <div>
              <p className="text-3xl font-extrabold text-foreground sm:text-4xl">&lt;3s</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Voice Latency
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-foreground sm:text-4xl">100%</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Offline Capable
              </p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-foreground sm:text-4xl">5,000+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Schools Targeted
              </p>
            </div>
          </div>
        </div>

        {/* Hero Right Composite Frame with Orbital Accent Ring matching the image */}
        <div className="relative flex items-center justify-center">
          {/* Orbital glowing ring */}
          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-[#ff782d]/30 animate-[spin_60s_linear_infinite]" />
          <div className="absolute -inset-10 rounded-full border border-indigo-500/20" />

          {/* Main Rounded Frame */}
            <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border-2 border-primary/40 bg-card p-6 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  Live Classroom Demo
                </span>
              </div>
              <span className="rounded-full bg-primary/20 border border-primary/40 px-3 py-1 text-xs font-extrabold text-[#ff9858]">
                Hindi &rarr; {language.name}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {/* Teacher Input Box */}
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Teacher Input (Hindi)
                </p>
                <p className="mt-1.5 text-lg font-bold text-foreground">{sample}</p>
              </div>

              {/* Translation arrow */}
              <div className="flex justify-center">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-white shadow-[0_2px_10px_rgba(255,120,45,0.5)]">
                  ↓
                </div>
              </div>

              {/* Synthesized Output Box */}
              <div className="rounded-2xl border border-mint bg-mint/60 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  Synthesized {language.name} Speech & Text
                </p>
                <p className="mt-1.5 text-lg font-bold text-foreground">
                  {translateToTribal(sample, language.code)}
                </p>
                <div className="mt-3.5 flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-white shadow">
                    ▶
                  </span>
                  <div className="flex h-5 flex-1 items-end gap-1">
                    {[3, 7, 9, 5, 8, 4, 6, 9, 5, 7].map((h, i) => (
                      <span
                        key={i}
                        className="w-1.5 rounded-full bg-emerald-400"
                        style={{ height: `${h * 2.5}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">0:03</span>
                </div>
              </div>
            </div>

            {/* Bottom floating badge */}
            <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Aligned with NIPUN Bharat FLN</span>
              <span className="font-bold text-emerald-400">Contextual Accuracy 98%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Language Engine Quick-Select Strip */}
      <section className="border-y border-border bg-card/70 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff8e4d]">
            Choose Target Tribal Dialect:
          </span>
          <LanguagePicker value={language.code} onChange={select} />
        </div>
      </section>

      {/* 4 Feature Highlights matching the 4 orange-icon cards in the image */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
            Application Features
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
            Everything Needed for Mother-Tongue Learning
          </h2>
          <p className="mt-2.5 text-sm text-muted-foreground">
            Built specifically for Jharkhand primary schools & offline Android tablet deployments.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <Link
            to="/assistant"
            className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/60"
          >
            <div className="edu-icon-badge">
              <Bot className="size-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              AI Voice Assistant
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
              Bidirectional speech dialogue assistant converting spoken Hindi into fluent Ho, Mundari, and Santhali with voice readout.
            </p>
            <span className="mt-6 mt-auto inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
              <span>Open Assistant</span> &rarr;
            </span>
          </Link>

          {/* Card 2 */}
          <Link
            to="/translate"
            className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/60"
          >
            <div className="edu-icon-badge">
              <FileText className="size-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              Curriculum Translation
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
              Context-aware NLP translation of standard Hindi FLN lesson scripts, activity instructions, and assessment prompts.
            </p>
            <span className="mt-6 mt-auto inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
              <span>Translate Lessons</span> &rarr;
            </span>
          </Link>

          {/* Card 3 */}
          <Link
            to="/voice"
            className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/60"
          >
            <div className="edu-icon-badge">
              <Mic className="size-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              Real-Time Voice
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
              Teacher speaks Hindi naturally and students hear responses in their mother tongue with under 3 seconds end-to-end latency.
            </p>
            <span className="mt-6 mt-auto inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
              <span>Start Voice Session</span> &rarr;
            </span>
          </Link>

          {/* Card 4 */}
          <Link
            to="/materials"
            className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/60"
          >
            <div className="edu-icon-badge">
              <FolderKanban className="size-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              Learning Materials
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
              Auto-generate bilingual printable worksheets, flashcard sets, and evaluation tasks aligned with NIPUN Bharat learning outcomes.
            </p>
            <span className="mt-6 mt-auto inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
              <span>Generate Materials</span> &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Middle "Creating a Lifelong Learning Best Community" Section matching image layout */}
      <section className="border-t border-border bg-card/70 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          {/* Left illustration/frame */}
          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem] border-2 border-border bg-card p-8 shadow-card">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  Offline-First Architecture
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                  Android 9+ &bull; &ge;2GB RAM
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span>Local Neural Voice Models</span>
                    <span className="text-emerald-400">100% Downloaded</span>
                  </div>
                  <div className="mt-2.5 h-2 rounded-full bg-[#1e285d]">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span>NIPUN Bharat Aligned Worksheets</span>
                    <span className="text-emerald-400">142 Ready</span>
                  </div>
                  <div className="mt-2.5 h-2 rounded-full bg-[#1e285d]">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-[#ff782d] to-amber-400" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary/10 p-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white font-bold">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Zero Cloud Dependency in Classroom</p>
                  <p className="text-[11px] text-muted-foreground">Functions completely offline after initial synchronization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right text & feature pills */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
              Academia–Industry Alliance
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl leading-tight">
              Building a Community for Lifelong Learning
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We connect universities, tribal language linguists, AI researchers, and industrial sponsors to build 
              state-of-the-art NLP engines for digitally under-resourced indigenous languages.
            </p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Zap className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Flexible On-Device AI Pipeline</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">Lightweight speech-to-text and acoustic synthesis running on low-cost hardware.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Globe className="size-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Real-Time Interactive Dialogues</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">Instant teacher-student classroom exchanges overcoming language barriers.</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/workspace" className="pill">
                <span>Discover More &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer matching eduAct aesthetic */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-3">
            <Brand size="sm" />
            <span className="border-l border-border pl-3 text-muted-foreground">
              Mother Tongue Bridge Vernacular Pedagogy Suite
            </span>
          </div>
          <p className="text-center sm:text-right">
            Built for PALASH MTB-MLE Primary Education &bull; Low-Cost Android Tablets &bull; 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
