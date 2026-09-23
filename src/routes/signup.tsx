import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCurrentUser, isValidEmail, signUp, type UserRole } from "@/lib/auth";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Register Account — Academia–Industry Collaboration" },
      {
        name: "description",
        content:
          "Register a new Student or Faculty account on the portal.",
      },
    ],
  }),
  component: SignupPage,
});

type SelectableRole = Exclude<UserRole, "teacher">;

interface RoleOption {
  role: SelectableRole;
  title: string;
  badge: string;
  description: string;
  icon: typeof GraduationCap;
  redirectTarget: string;
  defaultOrg: string;
  defaultDept: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "student",
    title: "Student",
    badge: "Student / Researcher",
    description: "Access learning tools, vernacular speech labs, and apply for industry capstones",
    icon: GraduationCap,
    redirectTarget: "/workspace",
    defaultOrg: "Indian Institute of Technology",
    defaultDept: "Computer Science & Engineering",
  },
  {
    role: "faculty",
    title: "Faculty",
    badge: "Faculty / Investigator",
    description: "Manage curriculum, research projects, student mentoring, and grant proposals",
    icon: BookOpen,
    redirectTarget: "/dashboard",
    defaultOrg: "Central University of Technology",
    defaultDept: "Applied AI & Linguistics",
  },
];

function SignupPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<SelectableRole>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    const current = getCurrentUser();
    if (current) {
      navigate({ to: "/workspace", replace: true });
    }
  }, [navigate]);

  function handleRoleChange(role: SelectableRole) {
    setSelectedRole(role);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // Comprehensive client-side validations
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Please provide your full legal name.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Full name must contain at least 2 characters.");
      return;
    }
    if (!trimmedEmail) {
      setError("Please provide your email address.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address (e.g., name@university.edu).");
      return;
    }
    if (!password) {
      setError("Please enter a secure password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    setLoading(true);

    try {
      const user = signUp({
        name: trimmedName,
        email: trimmedEmail,
        password,
        role: selectedRole,
      });

      navigate({ to: "/workspace", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const activeOption = ROLE_OPTIONS.find((r) => r.role === selectedRole) ?? ROLE_OPTIONS[0]!;

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
            Create an account to join the network as a Student or Faculty member.
          </p>
        </div>

        {/* Auth Card */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          {/* Step 1: Select Role */}
          <div className="mb-6">
            <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Step 1: Select Your Affiliation Role
            </label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {ROLE_OPTIONS.map((r) => {
                const isSelected = selectedRole === r.role;
                const IconComponent = r.icon;
                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleRoleChange(r.role)}
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

            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
              <span className="rounded-md bg-primary/20 px-1.5 py-0.5 font-bold text-primary">
                {activeOption.badge}
              </span>
              <p className="flex-1 text-muted-foreground">
                {activeOption.description} &bull;{" "}
                <span className="font-semibold text-foreground">
                  Redirects to {activeOption.redirectTarget}
                </span>
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-bold text-foreground">
                Full Name *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <User className="size-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Prof. Alex Morgan / Dr. Jane Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-foreground">
                Email *
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
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-bold text-foreground"
                >
                  Password (min. 6 characters) *
                </label>
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-bold text-foreground"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="size-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background py-2.5 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
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
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create {activeOption.title} Account</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="font-bold text-primary underline-offset-4 hover:underline">
              Sign in to your account
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
