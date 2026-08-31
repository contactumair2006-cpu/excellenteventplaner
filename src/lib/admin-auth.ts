import { isSupabaseConfigured } from "@/lib/supabase-env";
import { mutateDb, readDb } from "@/lib/local-db";

const SESSION_KEY = "eep-admin-session";
export const ADMIN_SESSION_EVENT = "eep-admin-session";

function emitSession() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ADMIN_SESSION_EVENT));
}

export type AdminUser = { email: string; local: boolean };

function readLocalSession(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminUser;
    return parsed?.email ? parsed : null;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured()) {
    return readLocalSession();
  }
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.auth.getSession();
  const email = data.session?.user?.email;
  return email ? { email, local: false } : null;
}

export function subscribeAdminSession(cb: (user: AdminUser | null) => void) {
  if (!isSupabaseConfigured()) {
    const onChange = () => cb(readLocalSession());
    window.addEventListener("storage", onChange);
    window.addEventListener(ADMIN_SESSION_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(ADMIN_SESSION_EVENT, onChange);
    };
  }
  let unsubscribe = () => {};
  void import("@/integrations/supabase/client").then(({ supabase }) => {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      const email = session?.user?.email;
      cb(email ? { email, local: false } : null);
    });
    unsubscribe = () => data.subscription.unsubscribe();
  });
  return () => unsubscribe();
}

export async function signInAdmin(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    const db = readDb();
    const emailOk = email.trim().toLowerCase() === db.adminEmail.toLowerCase();
    if (!emailOk || password !== db.adminPassword) {
      throw new Error("Invalid email or password");
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: db.adminEmail, local: true } satisfies AdminUser));
    emitSession();
    return;
  }
  const { supabase } = await import("@/integrations/supabase/client");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message || "Login failed");
}

export async function signOutAdmin() {
  localStorage.removeItem(SESSION_KEY);
  emitSession();
  if (!isSupabaseConfigured()) return;
  const { supabase } = await import("@/integrations/supabase/client");
  await supabase.auth.signOut();
}

export async function updateAdminCredentials(next: { email?: string; password?: string }) {
  if (!isSupabaseConfigured()) {
    mutateDb((db) => ({
      ...db,
      adminEmail: next.email?.trim() || db.adminEmail,
      adminPassword: next.password || db.adminPassword,
    }));
    if (next.email?.trim()) {
      const session = readLocalSession();
      if (session) {
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ email: next.email.trim(), local: true } satisfies AdminUser),
        );
        emitSession();
      }
    }
    return;
  }
  if (next.password) {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.auth.updateUser({ password: next.password });
    if (error) throw new Error(error.message);
  }
}

export async function updateAdminPassword(password: string) {
  await updateAdminCredentials({ password });
}

export function localAdminHint() {
  if (isSupabaseConfigured()) return null;
  const db = readDb();
  return { email: db.adminEmail, password: db.adminPassword };
}
