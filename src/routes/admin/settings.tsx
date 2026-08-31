import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminField, adminPrimary } from "@/components/admin/admin-ui";
import { toast } from "sonner";
import { isSupabaseConfigured } from "@/lib/supabase-env";
import { localAdminHint, updateAdminCredentials } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
});

function AdminSettings() {
  const hint = localAdminHint();
  const [email, setEmail] = useState(hint?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (password && password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password && password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      const payload: { email?: string; password?: string } = {};
      if (email.trim()) payload.email = email.trim();
      if (password) payload.password = password;
      await updateAdminCredentials(payload);
      setPassword("");
      setConfirm("");
      toast.success("Admin settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Admin Settings">
      <form onSubmit={save} className="max-w-lg rounded-sm border border-border bg-[#141414] p-6">
        <h2 className="font-display text-xl text-gold">Login details</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSupabaseConfigured()
            ? "Password updates your Supabase Auth user."
            : "These credentials are stored in this browser and used to open the admin panel."}
        </p>
        {!isSupabaseConfigured() ? (
          <>
            <label className="mt-5 block text-[0.58rem] uppercase tracking-[0.28em] text-muted-foreground">
              Admin email
            </label>
            <input type="email" className={`mt-2 ${adminField}`} value={email} onChange={(e) => setEmail(e.target.value)} />
          </>
        ) : null}
        <label className="mt-5 block text-[0.58rem] uppercase tracking-[0.28em] text-muted-foreground">
          New password
        </label>
        <input type="password" className={`mt-2 ${adminField}`} value={password} onChange={(e) => setPassword(e.target.value)} />
        <label className="mt-4 block text-[0.58rem] uppercase tracking-[0.28em] text-muted-foreground">
          Confirm password
        </label>
        <input type="password" className={`mt-2 ${adminField}`} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <button type="submit" disabled={saving} className={`${adminPrimary} mt-6`}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </AdminShell>
  );
}
