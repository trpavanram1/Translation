import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DEMO_USERS, getCurrentUser, isValidEmail, login } from "@/lib/auth";
import {
  GraduationCap,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect:
      search.redirect === "/assistant" || search.redirect === "/workspace"
        ? search.redirect
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Portal Login — Academia–Industry Collaboration" },
      {
        name: "description",
        content:
          "Sign in to the Academia–Industry Collaboration Portal with your Student account.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const destination = redirect ?? "/workspace";
  const [email, setEmail] = useState(DEMO_USERS.student.email);
  const [password, setPassword] = useState(DEMO_USERS.student.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

// If already logged in, redirect to the workspace
      useEffect(() => {
        const current = getCurrentUser();
        if (current) {
          navigate({ to: destination, replace: true });
    }
  }, [destination, navigate]);

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
        role: "student",
      });

      navigate({ to: destination, replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
            <Link
              to="/"
              aria-label="Student login"
              className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
            >
              <GraduationCap className="size-8" />
            </Link>
          </div>
          <p className="mt-2 text-sm font-bold text-primary">Student Login</p>
          <p className="mt-2.5 text-sm text-muted-foreground">
            Sign in to your portal account to access R&D collaborations and vernacular tools.
          </p>
        </div>

        {/* Auth Card */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
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
                  <span>Sign in as Student</span>
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
