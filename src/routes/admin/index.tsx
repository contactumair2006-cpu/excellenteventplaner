import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { loadSiteInquiries } from "@/lib/inquiry-client";
import type { InquiryRecord } from "@/lib/inquiries.functions";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin — Excellent Event Planner" }] }),
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    newer: 0,
    confirmed: 0,
  });
  const [recent, setRecent] = useState<InquiryRecord[]>([]);

  useEffect(() => {
    loadSiteInquiries()
      .then((res) => {
        const rows = res.rows ?? [];
        setRecent(rows.slice(0, 6));
        setStats({
          total: rows.length,
          newer: rows.filter((r) => !r.status || r.status === "new").length,
          confirmed: rows.filter((r) => r.status === "confirmed").length,
        });
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  const cards = [
    { label: "Total Inquiries", value: stats.total },
    { label: "New Inquiries", value: stats.newer },
    { label: "Confirmed", value: stats.confirmed },
  ];

  return (
    <AdminShell title="Dashboard Overview">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-sm border border-border bg-[#141414] p-6">
            <p className="text-[0.58rem] uppercase tracking-[0.3em] text-muted-foreground">
              {c.label}
            </p>
            <p className="mt-3 font-display text-4xl text-gold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/admin/inquiries"
          className="rounded-sm border border-primary/50 px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.28em] text-primary"
        >
          Manage Inquiries
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-sm border border-border px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground"
        >
          View Website
        </a>
      </div>

      <div className="mt-10 rounded-sm border border-border bg-[#141414]">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-xl text-foreground">Recent Inquiries</h2>
        </div>
        <div className="divide-y divide-border">
          {recent.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">No inquiries yet.</p>
          ) : (
            recent.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm text-foreground">{r.full_name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.event_type} · {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-sm border border-primary/30 px-3 py-1 text-[0.55rem] uppercase tracking-[0.25em] text-primary">
                  {r.status || "new"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
