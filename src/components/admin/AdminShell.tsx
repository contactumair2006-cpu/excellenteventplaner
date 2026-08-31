import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  Settings,
  HelpCircle,
  MessageSquareQuote,
  LogOut,
  Menu,
  X,
  Image,
  UtensilsCrossed,
  CalendarDays,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminSession,
  signOutAdmin,
  subscribeAdminSession,
  type AdminUser,
} from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase-env";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/content", label: "Website Content", icon: Settings },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/menus", label: "Menus", icon: UtensilsCrossed },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/settings", label: "Settings", icon: KeyRound },
];

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    getAdminSession().then((session) => {
      if (!mounted) return;
      setUser(session);
      setLoading(false);
      if (!session) navigate({ to: "/admin/login" });
    });
    const unsub = subscribeAdminSession((session) => {
      setUser(session);
      if (!session) navigate({ to: "/admin/login" });
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, [navigate]);

  async function signOut() {
    await signOutAdmin();
    toast.success("Signed out");
    navigate({ to: "/admin/login" });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-sm text-muted-foreground">
        Loading admin…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-foreground lg:grid lg:grid-cols-[240px_1fr]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-[#141414] p-5 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl text-gold">Excellent Event Planner</p>
            <p className="mt-1 text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
              Admin{!isSupabaseConfigured() ? " · Local" : ""}
            </p>
          </div>
          <button type="button" className="lg:hidden" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="mt-10 flex flex-col gap-1">
          {nav.map((item) => {
            const active =
              item.to === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname.startsWith(item.to);
            return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                active ? "bg-card text-primary" : "text-muted-foreground hover:bg-card hover:text-primary"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
            );
          })}
        </nav>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mt-6 block rounded-sm border border-border px-3 py-2.5 text-sm text-muted-foreground hover:text-primary"
        >
          View website
        </a>
        <button
          type="button"
          onClick={signOut}
          className="mt-3 flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground hover:text-primary"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-[#0f0f0f]/90 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button type="button" className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="font-display text-2xl text-gold">{title}</h1>
          </div>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
      {open ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
