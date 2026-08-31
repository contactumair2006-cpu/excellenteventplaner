import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaInput } from "@/components/admin/MediaInput";
import { adminBtn, adminField, adminPrimary } from "@/components/admin/admin-ui";
import { addEvent, listEvents, patchEvent, removeEvent } from "@/lib/cms-api";
import type { EventRow } from "@/lib/local-db";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
  head: () => ({ meta: [{ title: "Events — Admin" }] }),
});

function AdminEvents() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [form, setForm] = useState({ title: "", description: "", image_url: "" });

  const load = useCallback(async () => {
    setRows(await listEvents(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    await addEvent({
      title: form.title,
      description: form.description,
      image_url: form.image_url || null,
    });
    setForm({ title: "", description: "", image_url: "" });
    toast.success("Event added to the website");
    void load();
  }

  return (
    <AdminShell title="Events Management">
      <div className="rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Add Event Category</h2>
        <div className="mt-4 grid gap-3">
          <input className={adminField} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className={adminField} rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <MediaInput value={form.image_url} onChange={(image_url) => setForm({ ...form, image_url })} placeholder="Image URL" />
        </div>
        <button type="button" onClick={add} className={`${adminPrimary} mt-4`}>
          Add Event
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <EventCard key={r.id} row={r} onChanged={load} />
        ))}
      </div>
    </AdminShell>
  );
}

function EventCard({ row, onChanged }: { row: EventRow; onChanged: () => Promise<void> | void }) {
  const [title, setTitle] = useState(row.title);
  const [description, setDescription] = useState(row.description);
  const [imageUrl, setImageUrl] = useState(row.image_url ?? "");

  async function save() {
    await patchEvent(row.id, { title, description, image_url: imageUrl || null });
    toast.success("Event saved");
    await onChanged();
  }

  return (
    <article className="overflow-hidden rounded-sm border border-border bg-[#141414]">
      {imageUrl ? <img src={imageUrl} alt={title} className="h-40 w-full object-cover" /> : null}
      <div className="space-y-3 p-5">
        <input className={adminField} value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className={adminField} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        <MediaInput value={imageUrl} onChange={setImageUrl} placeholder="Image URL" />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={save} className={adminBtn}>
            Save
          </button>
          <button
            type="button"
            onClick={async () => {
              await patchEvent(row.id, { is_visible: !row.is_visible });
              await onChanged();
            }}
            className={adminBtn}
          >
            {row.is_visible ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Delete this event from the website?")) return;
              await removeEvent(row.id);
              toast.success("Deleted");
              await onChanged();
            }}
            className="rounded-sm border border-destructive/40 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.25em] text-destructive"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
