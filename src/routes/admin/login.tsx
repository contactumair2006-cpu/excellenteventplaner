import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { logoUrl } from "@/lib/venue-content";
import { toast } from "sonner";
import { getAdminSession, signInAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
  head: () => ({
    meta: [{ title: "Admin Login — Excellent Event Planner" }],
  }),
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAdminSession().then((session) => {
      if (session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInAdmin(email, password);
      toast.success("Welcome back");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-sm border border-border bg-card/60 px-4 py-3 text-sm focus:border-primary focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-md rounded-sm border border-border bg-[#141414] p-8 md:p-10 shadow-2xl">
        <img
          src={logoUrl}
          alt="Excellent Event Planner"
          className="mx-auto h-16 w-16 rounded-full object-cover ring-1 ring-primary/40"
        />
        <h1 className="mt-6 text-center font-display text-3xl text-gold">Admin Access</h1>
        <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Excellent Event Planner Dashboard
        </p>
        <form onSubmit={onSubmit} className="mt-10 space-y-4">
          <div>
            <label className="block text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gold w-full rounded-sm px-6 py-3.5 text-[0.65rem] uppercase tracking-[0.3em] text-primary-foreground font-semibold disabled:opacity-60 transition-opacity hover:opacity-90 mt-2"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
