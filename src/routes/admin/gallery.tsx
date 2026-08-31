import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaInput } from "@/components/admin/MediaInput";
import { adminBtn, adminField, adminPrimary } from "@/components/admin/admin-ui";
import { addGallery, listGallery, patchGallery, removeGallery } from "@/lib/cms-api";
import type { GalleryRow } from "@/lib/local-db";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGallery,
  head: () => ({ meta: [{ title: "Gallery — Admin" }] }),
});

const categories = ["Videos", "Weddings", "Events", "Venue", "Food", "Décor"];

function isVideo(url: string, category: string) {
  return (
    category === "Videos" ||
    url.startsWith("data:video") ||
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.includes("/videos/")
  );
}

function AdminGallery() {
  const [rows, setRows] = useState<GalleryRow[]>([]);
  const [form, setForm] = useState({
    url: "",
    title: "",
    description: "",
    category: "Weddings",
  });

  const load = useCallback(async () => {
    setRows(await listGallery(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add() {
    if (!form.url.trim() || !form.title.trim()) {
      toast.error("Media and title are required");
      return;
    }
    await addGallery({
      url: form.url,
      title: form.title,
      description: form.description || null,
      category: form.category,
      is_featured: false,
      is_visible: true,
    });
    setForm({ url: "", title: "", description: "", category: "Weddings" });
    toast.success("Added to the website gallery");
    void load();
  }

  return (
    <AdminShell title="Gallery Management">
      <div className="rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Add Image or Video</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Paste a URL or upload a file. Visible items appear in the public gallery after you add them.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <MediaInput value={form.url} onChange={(url) => setForm({ ...form, url })} />
          <input className={adminField} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={adminField} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className={adminField} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={add} className={`${adminPrimary} mt-4`}>
          Add Media
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <GalleryCard key={r.id} row={r} onChanged={load} />
        ))}
      </div>
    </AdminShell>
  );
}

function GalleryCard({ row, onChanged }: { row: GalleryRow; onChanged: () => Promise<void> | void }) {
  const [title, setTitle] = useState(row.title);
  const [url, setUrl] = useState(row.url);
  const [category, setCategory] = useState(row.category);
  const video = isVideo(url, category);

  async function save() {
    await patchGallery(row.id, { title, url, category });
    toast.success("Gallery item saved");
    await onChanged();
  }

  return (
    <article className="overflow-hidden rounded-sm border border-border bg-[#141414]">
      {video ? (
        <video src={url} muted playsInline autoPlay loop className="h-40 w-full object-cover bg-black" />
      ) : (
        <img src={url} alt={title} className="h-40 w-full object-cover" />
      )}
      <div className="space-y-2 p-4">
        <input className={adminField} value={title} onChange={(e) => setTitle(e.target.value)} />
        <select className={adminField} value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <MediaInput value={url} onChange={setUrl} />
        <div className="flex flex-wrap gap-2 pt-1">
          <button type="button" onClick={save} className={adminBtn}>
            Save
          </button>
          <button
            type="button"
            onClick={async () => {
              await patchGallery(row.id, { is_visible: !row.is_visible });
              await onChanged();
            }}
            className={adminBtn}
          >
            {row.is_visible ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Delete this item from the website?")) return;
              await removeGallery(row.id);
              toast.success("Deleted");
              await onChanged();
            }}
            className="rounded-sm border border-destructive/40 px-2.5 py-1 text-[0.52rem] uppercase tracking-[0.2em] text-destructive"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
