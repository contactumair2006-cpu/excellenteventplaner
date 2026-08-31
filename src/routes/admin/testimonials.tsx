import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminBtn, adminField, adminPrimary } from "@/components/admin/admin-ui";
import { addTestimonial, listTestimonials, patchTestimonial, removeTestimonial } from "@/lib/cms-api";
import type { TestimonialRow } from "@/lib/local-db";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonials,
  head: () => ({ meta: [{ title: "Testimonials — Admin" }] }),
});

function AdminTestimonials() {
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [form, setForm] = useState({ quote: "", name: "", event_label: "", rating: 5 });

  const load = useCallback(async () => {
    setRows(await listTestimonials(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add() {
    if (!form.quote.trim() || !form.name.trim()) {
      toast.error("Quote and name required");
      return;
    }
    await addTestimonial(form);
    setForm({ quote: "", name: "", event_label: "", rating: 5 });
    toast.success("Testimonial added to the website");
    void load();
  }

  return (
    <AdminShell title="Testimonials">
      <div className="rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Add Testimonial</h2>
        <textarea className={`${adminField} mt-4`} rows={3} placeholder="Quote" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <input className={adminField} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={adminField} placeholder="Event type" value={form.event_label} onChange={(e) => setForm({ ...form, event_label: e.target.value })} />
          <input className={adminField} type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
        </div>
        <button type="button" onClick={add} className={`${adminPrimary} mt-4`}>
          Add
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <TestimonialCard key={r.id} row={r} onChanged={load} />
        ))}
      </div>
    </AdminShell>
  );
}

function TestimonialCard({ row, onChanged }: { row: TestimonialRow; onChanged: () => Promise<void> | void }) {
  const [quote, setQuote] = useState(row.quote);
  const [name, setName] = useState(row.name);
  const [eventLabel, setEventLabel] = useState(row.event_label ?? "");
  const [rating, setRating] = useState(row.rating || 5);

  async function save() {
    await patchTestimonial(row.id, { quote, name, event_label: eventLabel || null, rating });
    toast.success("Testimonial saved");
    await onChanged();
  }

  return (
    <article className="rounded-sm border border-border bg-[#141414] p-5">
      <textarea className={adminField} rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} />
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <input className={adminField} value={name} onChange={(e) => setName(e.target.value)} />
        <input className={adminField} value={eventLabel} onChange={(e) => setEventLabel(e.target.value)} />
        <input className={adminField} type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={save} className={adminBtn}>
          Save
        </button>
        <button
          type="button"
          onClick={async () => {
            await patchTestimonial(row.id, { is_approved: !row.is_approved });
            await onChanged();
          }}
          className={adminBtn}
        >
          {row.is_approved ? "Hide" : "Show on site"}
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!confirm("Delete this testimonial?")) return;
            await removeTestimonial(row.id);
            toast.success("Deleted");
            await onChanged();
          }}
          className="rounded-sm border border-destructive/40 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.25em] text-destructive"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
