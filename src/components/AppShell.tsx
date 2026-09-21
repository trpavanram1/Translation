import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Building2, User, LogOut, LogIn, LayoutDashboard, Languages, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { LANGUAGES, type LangCode, type Language } from "@/lib/lang";
import { getCurrentUser, logout, subscribeToAuth, type AuthUser } from "@/lib/auth";

export function PortalBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute -top-24 -left-24 size-72 rounded-full bg-blush/25" />
      <div className="absolute top-1/3 -right-20 size-80 rounded-full bg-sky/35" />
      <div className="absolute bottom-0 left-1/3 size-56 rounded-full bg-mint/30" />
    </div>
  );
}

// Keep CandyBackdrop export for backwards compatibility
export const CandyBackdrop = PortalBackdrop;

export function Brand({ size = "md" }: { size?: "sm" | "md" | "lg" } = {}) {
  const heightClass = size === "sm" ? "h-6" : size === "lg" ? "h-12" : "h-10";
  return (
    <Link to="/" className="flex items-center transition-opacity hover:opacity-90">
      <img
        src="/codex-logo.svg"
        alt="CODEX"
        className={`${heightClass} w-auto object-contain transition-all`}
      />
    </Link>
  );
}

export function OfflineChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Offline Ready
    </span>
  );
}

export function LanguagePicker({
  value,
  onChange,
  size = "md",
}: {
  value: LangCode;
  onChange: (code: LangCode) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          aria-pressed={value === l.code}
          className={[
            "rounded-full font-bold transition-all duration-200",
            size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-xs",
            value === l.code
              ? "bg-primary text-white shadow-[0_2px_12px_rgba(255,120,45,0.4)]"
              : "border border-[#252f6d] bg-[#12183d] text-muted-foreground hover:border-primary/40 hover:text-white",
          ].join(" ")}
        >
          {l.name}
        </button>
      ))}
    </div>
  );
}

const TABS = [
  { to: "/workspace", label: "Workspace" },
  { to: "/assistant", label: "AI Voice Assistant" },
  { to: "/translate", label: "Curriculum Translation" },
  { to: "/voice", label: "Real-Time Voice" },
  { to: "/materials", label: "Learning Materials" },
  { to: "/flashcards", label: "Flashcards" },
] as const;

export function AppShell({
  children,
  language,
  onLanguageChange,
}: {
  children: ReactNode;
  language: Language;
  onLanguageChange: (code: LangCode) => void;
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());

  useEffect(() => {
    const unsub = subscribeToAuth((nextUser) => {
      setUser(nextUser);
    });
    return unsub;
  }, []);

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  const roleBadgeStyles: Record<string, string> = {
    student: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    faculty: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    industry: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    admin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    teacher: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <PortalBackdrop />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <Brand size="md" />

          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
              <Languages className="size-3.5 text-primary" />
              Hindi &rarr; {language.name}
            </span>

            <OfflineChip />

            {user ? (
              <div className="flex items-center gap-2 border-l border-border pl-3">
                <Link
                  to="/workspace"
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/50"
                >
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                      roleBadgeStyles[user.role] ?? roleBadgeStyles["faculty"]
                    }`}
                  >
                    {user.role}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Log out"
                  className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:border-destructive/50 hover:bg-destructive/20 hover:text-destructive"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 border-l border-border pl-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold text-foreground shadow-sm transition hover:border-primary/50 hover:text-primary"
                >
                  <LogIn className="size-3.5 text-primary" />
                  <span>Sign In</span>
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

        {/* Secondary Sub-navigation Tabs */}
        <nav className="border-t border-border/80 bg-card/80">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6">
            {TABS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                activeProps={{
                  className: "bg-primary text-white font-bold shadow-[0_2px_10px_rgba(255,120,45,0.35)]",
                }}
                inactiveProps={{
                  className: "text-muted-foreground hover:bg-accent hover:text-foreground font-medium",
                }}
                className="inline-flex shrink-0 items-center rounded-full px-3.5 py-1.5 text-xs transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/90">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-foreground">Target Language:</span>
            <LanguagePicker value={language.code} onChange={onLanguageChange} size="sm" />
          </div>
          <p className="text-center sm:text-right text-muted-foreground">
            CODEX &bull; Vernacular AI Pedagogy & Academia–Industry R&D &bull; 100% Offline Capable
          </p>
        </div>
      </footer>
    </div>
  );
}
