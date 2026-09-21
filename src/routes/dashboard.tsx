import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Brand } from "@/components/AppShell";
import {
  acceptRequest,
  createRequest,
  getCurrentUser,
  logout,
  rejectRequest,
  subscribeToAuth,
  subscribeToRequests,
  type AuthUser,
  type RequestCategory,
  type RequestStatus,
  type UserRequest,
} from "@/lib/auth";
import {
  GraduationCap,
  BookOpen,
  Building2,
  ShieldCheck,
  PlusCircle,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
  ArrowRight,
  Sparkles,
  Search,
  Building,
  User,
  Send,
  HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Collaboration Dashboard — Academia–Industry Portal" },
      {
        name: "description",
        content:
          "Manage joint academia-industry research projects, curriculum validations, problem statements, and student capstones.",
      },
    ],
  }),
  component: DashboardPage,
});

const ROLE_DISPLAY_CONFIG: Record<
  string,
  {
    label: string;
    tagline: string;
    icon: typeof GraduationCap;
    badgeStyle: string;
    formTitle: string;
    formPlaceholderTitle: string;
    formPlaceholderMessage: string;
  }
> = {
  student: {
    label: "Student Researcher",
    tagline:
      "Explore industry problem statements, request faculty mentorship, and submit capstones.",
    icon: GraduationCap,
    badgeStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    formTitle: "Submit Student Capstone / Mentorship Request",
    formPlaceholderTitle: "e.g., Evaluation of Mundari Speech Acoustic Models",
    formPlaceholderMessage:
      "Describe your project scope, target language, and what support you are seeking...",
  },
  faculty: {
    label: "Faculty Investigator",
    tagline:
      "Lead collaborative research, validate vernacular curriculum packs, and mentor student projects.",
    icon: BookOpen,
    badgeStyle: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    formTitle: "Propose Academic Project / Curriculum Review",
    formPlaceholderTitle: "e.g., Santhali FLN Math Curriculum Alignment Review",
    formPlaceholderMessage:
      "Provide research objectives, required industry domain inputs, and student involvement...",
  },
  industry: {
    label: "Industry Partner",
    tagline:
      "Post enterprise problem statements, sponsor vernacular AI projects, and discover emerging talent.",
    icon: Building2,
    badgeStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    formTitle: "Post Industry Problem Statement / Sponsorship",
    formPlaceholderTitle: "e.g., On-Device Low-Latency Speech Synthesis Engine (<2GB RAM)",
    formPlaceholderMessage:
      "Detail the problem context, dataset availability, compute credits, and desired outcomes...",
  },
  admin: {
    label: "Portal Administrator",
    tagline:
      "Oversee institutional agreements, manage collaboration workflows, and monitor portal impact.",
    icon: ShieldCheck,
    badgeStyle: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    formTitle: "Publish Institutional Announcement / Notice",
    formPlaceholderTitle: "e.g., Call for Joint Innovation Grant Proposals (Cycle 2)",
    formPlaceholderMessage:
      "Enter official portal announcement or compliance guidelines for participants...",
  },
  teacher: {
    label: "Faculty Investigator",
    tagline:
      "Lead collaborative research, validate vernacular curriculum packs, and mentor student projects.",
    icon: BookOpen,
    badgeStyle: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    formTitle: "Propose Academic Project / Curriculum Review",
    formPlaceholderTitle: "e.g., Santhali FLN Math Curriculum Alignment Review",
    formPlaceholderMessage:
      "Provide research objectives, required industry domain inputs, and student involvement...",
  },
};

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<RequestCategory>("research");
  const [statusFilter, setStatusFilter] = useState<"all" | RequestStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      navigate({ to: "/login", replace: true });
      return;
    }

    navigate({ to: "/workspace", replace: true });

    const unsubAuth = subscribeToAuth((nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        navigate({ to: "/login", replace: true });
      }
    });

    const unsubRequests = subscribeToRequests((nextRequests) => {
      setRequests(nextRequests);
    });

    return () => {
      unsubAuth();
      unsubRequests();
    };
  }, [navigate]);

  const fallbackConfig = ROLE_DISPLAY_CONFIG["faculty"]!;
  const activeRoleConfig = (user ? ROLE_DISPLAY_CONFIG[user.role] : null) ?? fallbackConfig;

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      accepted: requests.filter((r) => r.status === "accepted").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (statusFilter !== "all" && req.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = req.title.toLowerCase().includes(q);
        const matchesMsg = req.message.toLowerCase().includes(q);
        const matchesUser = req.userName.toLowerCase().includes(q);
        const matchesOrg = req.userOrg?.toLowerCase().includes(q) ?? false;
        return matchesTitle || matchesMsg || matchesUser || matchesOrg;
      }
      return true;
    });
  }, [requests, statusFilter, searchQuery]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !message.trim()) {
      setError("Please fill out both the title and the detailed message.");
      return;
    }

    setIsSubmitting(true);
    try {
      createRequest({
        title: title.trim(),
        message: message.trim(),
        category,
      });
      setTitle("");
      setMessage("");
      setSuccess("Your collaboration item was published to the portal in real-time.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to publish collaboration item.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAccept(id: string) {
    try {
      acceptRequest(id);
      setSuccess("Item marked as Accepted & In-Progress.");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error accepting request.");
    }
  }

  function handleReject(id: string) {
    try {
      rejectRequest(id);
      setSuccess("Item marked as Archived / Declined.");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating request status.");
    }
  }

  function handleLogout() {
    logout();
    navigate({ to: "/login", replace: true });
  }

  if (!user) {
    return null;
  }

  const IconComponent = activeRoleConfig.icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Banner */}
      <div className="border-b border-border bg-card/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Brand size="sm" />
            <div className="hidden h-6 w-px bg-border sm:block" />
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <IconComponent className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    {user.name}
                  </h1>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${activeRoleConfig.badgeStyle}`}
                  >
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.organization || "Affiliated Partner"} &bull; {activeRoleConfig.tagline}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/workspace"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/50"
            >
              <span>Vernacular Workspace</span>
              <ArrowRight className="size-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* KPI Cards */}
        <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Total Proposals</span>
              <BookOpen className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {stats.total}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Active submissions across all roles
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-card p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider">
                In Review / Pending
              </span>
              <Clock className="size-4" />
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {stats.pending}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">Awaiting institutional action</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-card p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider">Accepted & Active</span>
              <CheckCircle2 className="size-4" />
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {stats.accepted}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">Funded / Active collaborations</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold uppercase tracking-wider">Connected Roles</span>
              <Building2 className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              4 Roles
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Student &bull; Faculty &bull; Industry &bull; Admin
            </p>
          </div>
        </section>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <XCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Main Grid: Form + Feed */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.45fr]">
          {/* Form Column */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-border pb-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <PlusCircle className="size-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {activeRoleConfig.formTitle}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Post to the shared real-time collaboration pipeline
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="req-category"
                  className="mb-1.5 block text-xs font-bold text-foreground"
                >
                  Collaboration Type
                </label>
                <select
                  id="req-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RequestCategory)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="research">Academic R&D / Research Grant</option>
                  <option value="project">Industry Problem Statement</option>
                  <option value="curriculum">Curriculum Validation & Assessment</option>
                  <option value="internship">Student Capstone / Internship</option>
                  <option value="general">Institutional Announcement</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="req-title"
                  className="mb-1.5 block text-xs font-bold text-foreground"
                >
                  Proposal / Problem Statement Title *
                </label>
                <input
                  id="req-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={activeRoleConfig.formPlaceholderTitle}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="req-message"
                  className="mb-1.5 block text-xs font-bold text-foreground"
                >
                  Detailed Description & Requirements *
                </label>
                <textarea
                  id="req-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={activeRoleConfig.formPlaceholderMessage}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90 disabled:opacity-60"
              >
                <Send className="size-3.5" />
                <span>{isSubmitting ? "Publishing..." : "Submit to Network"}</span>
              </button>
            </form>
          </section>

          {/* Real-time Collaboration Feed Column */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground">
                    Live Collaboration Network
                  </h2>
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sync
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Proposals, requests, and industry problem statements
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(["all", "pending", "accepted", "rejected"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setStatusFilter(filter)}
                    className={[
                      "rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition",
                      statusFilter === filter
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-background text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Search bar */}
            <div className="my-4">
              <div className="relative">
                <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword, title, organization, or author..."
                  className="w-full rounded-xl border border-input bg-background py-1.5 pr-3 pl-9 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-3.5">
              {filteredRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                  No collaboration items match your current filter. Submit one from the left form!
                </div>
              ) : (
                filteredRequests.map((req) => {
                  const statusColors = {
                    accepted:
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                    pending:
                      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                    rejected: "bg-destructive/10 text-destructive border-destructive/20",
                  };

                  return (
                    <div
                      key={req.id}
                      className="rounded-xl border border-border bg-background/70 p-4 transition hover:border-primary/40"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-foreground">
                              {req.userName}
                            </span>
                            {req.userRole && (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                                {req.userRole}
                              </span>
                            )}
                            {req.userOrg && (
                              <span className="text-[11px] text-muted-foreground">
                                &bull; {req.userOrg}
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1 text-sm font-bold text-foreground">{req.title}</h3>
                        </div>

                        <span
                          className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            statusColors[req.status] || statusColors.pending
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                        {req.message}
                      </p>

                      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground">
                        <span>
                          Submitted {new Date(req.createdAt).toLocaleDateString()} at{" "}
                          {new Date(req.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {/* Action buttons (Faculty, Industry, Admin can review) */}
                        {req.status === "pending" && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAccept(req.id)}
                              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition hover:bg-emerald-700"
                            >
                              Accept / Sponsor
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(req.id)}
                              className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
