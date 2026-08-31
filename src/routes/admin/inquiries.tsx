import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  deleteSiteInquiry,
  loadSiteInquiries,
  updateSiteInquiry,
} from "@/lib/inquiry-client";
import type { InquiryRecord } from "@/lib/inquiries.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiries,
  head: () => ({ meta: [{ title: "Inquiries — Admin" }] }),
});

const STATUSES = ["new", "contacted", "interested", "follow-up", "confirmed", "closed"] as const;

function AdminInquiries() {
  const [rows, setRows] = useState<InquiryRecord[]>([]);
  const [source, setSource] = useState<string>("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await loadSiteInquiries();
      setRows(res.rows ?? []);
      setSource(res.source);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const hay = `${r.full_name} ${r.phone} ${r.email ?? ""} ${r.event_type}`.toLowerCase();
      const matchQ = !q || hay.includes(q.toLowerCase());
      const st = r.status || "new";
      const matchS = status === "all" || st === status;
      return matchQ && matchS;
    });
  }, [rows, q, status]);

  async function changeStatus(id: string, next: string) {
    try {
      await updateSiteInquiry(id, { status: next });
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
      toast.success("Status updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function saveNotes(id: string, notes: string) {
    try {
      await updateSiteInquiry(id, { internal_notes: notes });
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, internal_notes: notes } : r)));
      toast.success("Notes saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function remove(id: string, created_at?: string) {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await deleteSiteInquiry(id, created_at);
      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  function exportCsv() {
    const header = [
      "full_name",
      "phone",
      "email",
      "event_type",
      "event_date",
      "guest_count",
      "status",
      "message",
      "created_at",
    ];
    const lines = [
      header.join(","),
      ...filtered.map((r) =>
        [
          r.full_name,
          r.phone,
          r.email ?? "",
          r.event_type,
          r.event_date ?? "",
          r.guest_count ?? "",
          r.status ?? "new",
          JSON.stringify(r.message ?? ""),
          r.created_at,
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `royal-marquee-inquiries-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const field =
    "rounded-sm border border-border bg-[#0f0f0f] px-3 py-2 text-sm focus:border-primary focus:outline-none";

  return (
    <AdminShell title="Booking Inquiries">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Source: {source || "…"} · {filtered.length} inquiries
        </p>
        <button
          type="button"
          onClick={load}
          className="rounded-sm border border-border px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.25em] text-muted-foreground"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone, email…"
          className={`${field} min-w-[220px] flex-1`}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={field}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-sm border border-border px-4 py-2 text-[0.58rem] uppercase tracking-[0.25em] text-muted-foreground"
        >
          Export CSV
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No matching inquiries.</p>
        ) : (
          filtered.map((r) => (
            <article key={r.id} className="rounded-sm border border-border bg-[#141414] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-gold">{r.full_name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {r.event_type}
                    {r.event_date ? ` · ${r.event_date}` : ""}
                    {r.guest_count ? ` · ${r.guest_count} guests` : ""}
                    {r.selected_package ? ` · ${r.selected_package}` : ""}
                  </p>
                  <p className="mt-2 text-sm">
                    <a href={`tel:${r.phone}`} className="text-primary hover:underline">
                      {r.phone}
                    </a>
                    {r.email ? (
                      <>
                        {" · "}
                        <a href={`mailto:${r.email}`} className="hover:text-primary">
                          {r.email}
                        </a>
                      </>
                    ) : null}
                  </p>
                  {r.message ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{r.message}</p>
                  ) : null}
                  <p className="mt-3 text-[0.58rem] uppercase tracking-[0.25em] text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <select
                    value={r.status || "new"}
                    onChange={(e) => changeStatus(r.id, e.target.value)}
                    className={field}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => remove(r.id, r.created_at)}
                    className="rounded-sm border border-destructive/40 px-3 py-2 text-[0.55rem] uppercase tracking-[0.25em] text-destructive"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <textarea
                defaultValue={r.internal_notes ?? ""}
                placeholder="Internal notes…"
                rows={2}
                className={`${field} mt-4 w-full`}
                onBlur={(e) => {
                  if (e.target.value !== (r.internal_notes ?? "")) {
                    saveNotes(r.id, e.target.value);
                  }
                }}
              />
            </article>
          ))
        )}
      </div>
    </AdminShell>
  );
}
