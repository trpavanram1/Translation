import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DEMO_USERS, getCurrentUser, isValidEmail, login, type UserRole } from "@/lib/auth";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Portal Login — Academia–Industry Collaboration" },
      {
        name: "description",
        content:
          "Sign in to the Academia–Industry Collaboration Portal with your Student or Faculty account.",
      },
    ],
  }),
  component: LoginPage,
});

type SelectableRole = Exclude<UserRole, "teacher">;

interface RoleMeta {
  role: SelectableRole;
  title: string;
  badge: string;
  description: string;
  icon: typeof GraduationCap;
  redirectPath: string;
}

const ROLES: RoleMeta[] = [
  {
    role: "student",
    title: "Student",
    badge: "Learner & Researcher",
    description: "Access vernacular learning tools, capstones, and industry internships",
    icon: GraduationCap,
    redirectPath: "/workspace",
  },
  {
    role: "faculty",
    title: "Faculty",
    badge: "Academic Lead",
    description: "Manage curriculum, research projects, grants, and student collaborations",
    icon: BookOpen,
    redirectPath: "/dashboard",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<SelectableRole>("faculty");
  const [email, setEmail] = useState(DEMO_USERS.faculty.email);
  const [password, setPassword] = useState(DEMO_USERS.faculty.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

// If already logged in, redirect to the workspace
      useEffect(() => {
        const current = getCurrentUser();
        if (current) {
          navigate({ to: "/workspace", replace: true });
    }
  }, [navigate]);

  // When role changes, prefill demo credentials for convenience
  function handleSelectRole(role: SelectableRole) {
    setSelectedRole(role);
    setEmail(DEMO_USERS[role].email);
    setPassword(DEMO_USERS[role].password);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // Client-side validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your registered email address.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setError("Please provide a valid email format (e.g., name@domain.com).");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const user = login({
        email: trimmedEmail,
        password,
        role: selectedRole,
      });

      navigate({ to: "/workspace", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const activeRoleMeta = ROLES.find((r) => r.role === selectedRole) ?? ROLES[1]!;

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm transition hover:border-primary/50 hover:text-foreground"
          >
            <span>← Back to Home</span>
          </Link>

          <div className="mt-5 flex justify-center">
            <Link to="/" className="inline-block transition-opacity hover:opacity-90">
              <img
                src="/codex-logo.svg"
                alt="CODEX"
                className="h-10 w-auto object-contain transition-all"
              />
            </Link>
          </div>
          <p className="mt-2.5 text-sm text-muted-foreground">
            Sign in to your portal account to access R&D collaborations and vernacular tools.
          </p>
        </div>

        {/* Auth Card */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          {/* Step 1: Role Selection */}
          <div className="mb-6">
            <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.role;
                const IconComponent = r.icon;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleSelectRole(r.role)}
                    className={[
                      "group relative flex flex-col items-center rounded-xl border p-3 text-center transition-all duration-150",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary"
                        : "border-border bg-background/60 text-muted-foreground hover:border-muted-foreground/40 hover:bg-background hover:text-foreground",
                    ].join(" ")}
                  >
                    <IconComponent
                      className={[
                        "size-5 transition",
                        isSelected
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                      ].join(" ")}
                    />
                    <span className="mt-1.5 text-xs font-bold tracking-tight">{r.title}</span>
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Role Description Banner */}
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
              <span className="rounded-md bg-primary/20 px-1.5 py-0.5 font-bold text-primary">
                {activeRoleMeta.badge}
              </span>
              <p className="flex-1 text-muted-foreground">
                {activeRoleMeta.description} &bull;{" "}
                <span className="font-semibold text-foreground">
                  Redirects to {activeRoleMeta.redirectPath}
                </span>
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-bold text-foreground"
              >
                <span>Institutional / Work Email</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail className="size-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="name@university.edu or name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5">
                <label htmlFor="password" className="text-xs font-bold text-foreground">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Lock className="size-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background py-2.5 pr-10 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign in as {activeRoleMeta.title}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Signup link */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Don't have an institutional account yet?{" "}
            <Link
              to="/signup"
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>National Academia–Industry Collaboration Network &bull; Secure Portal</p>
        </div>
      </div>
    </div>
  );
}
