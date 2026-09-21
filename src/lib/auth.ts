export type UserRole = "student" | "faculty" | "industry" | "admin" | "teacher";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization?: string | undefined;
  department?: string | undefined;
  createdAt: string;
};

export type RequestStatus = "pending" | "accepted" | "rejected";
export type RequestCategory = "research" | "project" | "internship" | "curriculum" | "general";

export type UserRequest = {
  id: string;
  userId: string;
  userName: string;
  userRole?: UserRole | undefined;
  userOrg?: string | undefined;
  title: string;
  message: string;
  category?: RequestCategory | undefined;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
};

const USERS_KEY = "bhashamitra_users";
const CURRENT_USER_KEY = "bhashamitra_current_user";
const REQUESTS_KEY = "bhashamitra_requests";

export const DEMO_USERS: Record<Exclude<UserRole, "teacher">, AuthUser> = {
  student: {
    id: "student-user",
    name: "Alex Morgan",
    email: "student@example.com",
    password: "student123",
    role: "student",
    organization: "National Institute of Technology",
    department: "Computer Science & AI",
    createdAt: new Date(0).toISOString(),
  },
  faculty: {
    id: "faculty-user",
    name: "Dr. Arvind Sharma",
    email: "faculty@example.com",
    password: "faculty123",
    role: "faculty",
    organization: "State University Research Council",
    department: "Applied Linguistics & NLP",
    createdAt: new Date(0).toISOString(),
  },
  industry: {
    id: "industry-user",
    name: "Priya Malhotra",
    email: "industry@example.com",
    password: "industry123",
    role: "industry",
    organization: "CognitiveTech Global Solutions",
    department: "Industry AI Partnerships & R&D",
    createdAt: new Date(0).toISOString(),
  },
  admin: {
    id: "admin-user",
    name: "System Administrator",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    organization: "Academia–Industry Innovation Directorate",
    department: "Platform Operations & Governance",
    createdAt: new Date(0).toISOString(),
  },
};

const DEFAULT_TEACHER_USER: AuthUser = {
  id: "teacher-user",
  name: "Dr. Arvind Sharma (Faculty)",
  email: "teacher@example.com",
  password: "teacher123",
  role: "faculty",
  organization: "State University Research Council",
  department: "Primary MTB-MLE Pedagogy",
  createdAt: new Date(0).toISOString(),
};

const SEED_REQUESTS: UserRequest[] = [
  {
    id: "req-1",
    userId: "industry-user",
    userName: "Priya Malhotra",
    userRole: "industry",
    userOrg: "CognitiveTech Global Solutions",
    title: "Industry Problem: Offline Neural ASR for Mundari & Ho Dialects",
    message:
      "Looking for academic research partner to optimize low-latency speech synthesis models for Android 9 tablets with <2GB RAM. Seed funding and GPU compute credits provided.",
    category: "research",
    status: "accepted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "req-2",
    userId: "faculty-user",
    userName: "Dr. Arvind Sharma",
    userRole: "faculty",
    userOrg: "State University Research Council",
    title: "Curriculum Validation: FLN Numeracy Worksheets for Santhali Primary Schools",
    message:
      "Need industry review of auto-generated bilingual grade 1-3 math worksheets aligned with NIPUN Bharat learning outcomes before field deployment.",
    category: "curriculum",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "req-3",
    userId: "student-user",
    userName: "Alex Morgan",
    userRole: "student",
    userOrg: "National Institute of Technology",
    title: "Student Capstone: Real-time Hindi-to-Tribal Audio Evaluation Benchmark",
    message:
      "Seeking faculty mentor and industry co-supervisor to evaluate speech recognition accuracy on 500 hours of vernacular classroom field recordings.",
    category: "internship",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "req-4",
    userId: "admin-user",
    userName: "System Administrator",
    userRole: "admin",
    userOrg: "Academia–Industry Innovation Directorate",
    title: "Portal Announcement: 2026 Innovation Grant Cycles Open",
    message:
      "Applications for collaborative Academia-Industry vernacular technology grants up to ₹15 Lakhs are now open for verified institutional members.",
    category: "general",
    status: "accepted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function emitRealtime(eventName: string, detail?: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

function setCurrentUser(user: AuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    writeStorage(CURRENT_USER_KEY, user);
  } else {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  }

  emitRealtime("bhashamitra-auth", user);
}

function ensureSeedUsers() {
  const users = readStorage<AuthUser[]>(USERS_KEY, []);
  const seeded = new Map(users.map((user) => [user.email.toLowerCase(), user]));

  // Ensure all 4 role demo accounts exist
  Object.values(DEMO_USERS).forEach((demo) => {
    if (!seeded.has(demo.email.toLowerCase())) {
      users.push(demo);
    }
  });

  // Ensure legacy teacher user is also seeded
  if (!seeded.has(DEFAULT_TEACHER_USER.email.toLowerCase())) {
    users.push(DEFAULT_TEACHER_USER);
  }

  writeStorage(USERS_KEY, users);
}

function ensureSeedRequests() {
  const requests = readStorage<UserRequest[]>(REQUESTS_KEY, []);
  if (requests.length === 0) {
    writeStorage(REQUESTS_KEY, SEED_REQUESTS);
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readStorage<AuthUser | null>(CURRENT_USER_KEY, null);
}

export function subscribeToAuth(callback: (user: AuthUser | null) => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const notify = () => callback(getCurrentUser());
  notify();

  const onEvent = () => notify();
  window.addEventListener("bhashamitra-auth", onEvent);

  const onStorage = (event: StorageEvent) => {
    if (event.key === CURRENT_USER_KEY) {
      notify();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("bhashamitra-auth", onEvent);
    window.removeEventListener("storage", onStorage);
  };
}

export function signUp(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization?: string | undefined;
  department?: string | undefined;
}) {
  ensureSeedUsers();

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password.trim();
  const role: UserRole = input.role || "student";
  const organization = input.organization?.trim();
  const department = input.department?.trim();

  if (!name || !email || !password) {
    throw new Error("Please fill in all required fields (Name, Email, Password).");
  }

  if (name.length < 2) {
    throw new Error("Full name must be at least 2 characters long.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Please enter a valid email address (e.g., name@domain.com).");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const users = readStorage<AuthUser[]>(USERS_KEY, []);
  const exists = users.some((user) => user.email.toLowerCase() === email);

  if (exists) {
    throw new Error("An account with this email address already exists.");
  }

  const user: AuthUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    role,
    organization: organization || undefined,
    department: department || undefined,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeStorage(USERS_KEY, users);
  setCurrentUser(user);

  return user;
}

export function login(input: { email: string; password: string; role?: UserRole }) {
  ensureSeedUsers();

  const email = input.email.trim().toLowerCase();
  const password = input.password.trim();
  const role = input.role;

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const users = readStorage<AuthUser[]>(USERS_KEY, []);

  // Find by email & password
  const user = users.find(
    (item) => item.email.toLowerCase() === email && item.password === password,
  );

  if (!user) {
    const existsByEmail = users.find((item) => item.email.toLowerCase() === email);
    if (existsByEmail) {
      throw new Error("Incorrect password for this account.");
    }
    throw new Error("No account found with this email. Please check your credentials or sign up.");
  }

  // If role is explicitly chosen, verify role compatibility
  if (role) {
    const matches = user.role === role || (role === "faculty" && user.role === "teacher");
    if (!matches) {
      throw new Error(
        `This account is registered under the "${user.role.toUpperCase()}" role. Please switch tabs to ${user.role}.`,
      );
    }
  }

  setCurrentUser(user);
  return user;
}

export function logout() {
  setCurrentUser(null);
}

export function listRequests(): UserRequest[] {
  ensureSeedRequests();
  const requests = readStorage<UserRequest[]>(REQUESTS_KEY, SEED_REQUESTS);
  return [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function subscribeToRequests(callback: (requests: UserRequest[]) => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const notify = () => callback(listRequests());
  notify();

  const onEvent = () => notify();
  window.addEventListener("bhashamitra-requests", onEvent);

  const onStorage = (event: StorageEvent) => {
    if (event.key === REQUESTS_KEY) {
      notify();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("bhashamitra-requests", onEvent);
    window.removeEventListener("storage", onStorage);
  };
}

export function createRequest(input: {
  title: string;
  message: string;
  category?: RequestCategory | undefined;
  userId?: string | undefined;
}) {
  const user = getCurrentUser();

  if (!user) {
    throw new Error("You must be logged in to submit a proposal or request.");
  }

  const title = input.title.trim();
  const message = input.message.trim();

  if (!title || !message) {
    throw new Error("Please provide both a title and details for your submission.");
  }

  const request: UserRequest = {
    id: crypto.randomUUID(),
    userId: input.userId ?? user.id,
    userName: user.name,
    userRole: user.role,
    userOrg: user.organization || user.department,
    title,
    message,
    category: input.category || "general",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const requests = readStorage<UserRequest[]>(REQUESTS_KEY, SEED_REQUESTS);
  requests.unshift(request);
  writeStorage(REQUESTS_KEY, requests);
  emitRealtime("bhashamitra-requests", requests);

  return request;
}

export function acceptRequest(requestId: string) {
  const requests = readStorage<UserRequest[]>(REQUESTS_KEY, SEED_REQUESTS);
  const index = requests.findIndex((request) => request.id === requestId);

  if (index === -1) {
    throw new Error("Collaboration request was not found.");
  }

  const existing = requests[index];
  if (!existing) {
    throw new Error("Collaboration request was not found.");
  }

  const updated: UserRequest = {
    ...existing,
    status: "accepted",
    updatedAt: new Date().toISOString(),
  };

  requests[index] = updated;
  writeStorage(REQUESTS_KEY, requests);
  emitRealtime("bhashamitra-requests", requests);

  return updated;
}

export function rejectRequest(requestId: string) {
  const requests = readStorage<UserRequest[]>(REQUESTS_KEY, SEED_REQUESTS);
  const index = requests.findIndex((request) => request.id === requestId);

  if (index === -1) {
    throw new Error("Collaboration request was not found.");
  }

  const existing = requests[index];
  if (!existing) {
    throw new Error("Collaboration request was not found.");
  }

  const updated: UserRequest = {
    ...existing,
    status: "rejected",
    updatedAt: new Date().toISOString(),
  };

  requests[index] = updated;
  writeStorage(REQUESTS_KEY, requests);
  emitRealtime("bhashamitra-requests", requests);

  return updated;
}
