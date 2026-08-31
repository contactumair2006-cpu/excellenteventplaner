import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminBtn, adminField, adminPrimary } from "@/components/admin/admin-ui";
import { addMenu, listMenus, patchMenu, removeMenu } from "@/lib/cms-api";
import type { MenuRow } from "@/lib/local-db";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/menus")({
  component: AdminMenus,
  head: () => ({ meta: [{ title: "Menus — Admin" }] }),
});

type Section = { label: string; items: string[] };

function AdminMenus() {
  const [rows, setRows] = useState<MenuRow[]>([]);
  const [name, setName] = useState("");
  const [badge, setBadge] = useState("");

  const load = useCallback(async () => {
    setRows(await listMenus(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add() {
    if (!name.trim()) {
      toast.error("Package name is required");
      return;
    }
    await addMenu({ name, badge: badge || null });
    setName("");
    setBadge("");
    toast.success("Package created — it appears on the website");
    void load();
  }

  return (
    <AdminShell title="Menu Management">
      <p className="text-sm text-muted-foreground">
        Enabled packages show on the public Menu & Catering section. Edit dishes below and click Save on each package.
      </p>

      <div className="mt-6 rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Create Package</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className={adminField} placeholder="Package name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={adminField} placeholder="Badge (e.g. Signature)" value={badge} onChange={(e) => setBadge(e.target.value)} />
        </div>
        <button type="button" onClick={add} className={`${adminPrimary} mt-4`}>
          Create
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <MenuEditor key={r.id} row={r} onChanged={load} />
        ))}
      </div>
    </AdminShell>
  );
}

function MenuEditor({ row, onChanged }: { row: MenuRow; onChanged: () => Promise<void> | void }) {
  const [name, setName] = useState(row.name);
  const [badge, setBadge] = useState(row.badge ?? "");
  const [sections, setSections] = useState<Section[]>(row.sections ?? []);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await patchMenu(row.id, {
      name: name.trim() || row.name,
      badge: badge || null,
      sections: sections.map((s) => ({
        label: s.label.trim() || "Section",
        items: s.items.map((i) => i.trim()).filter(Boolean),
      })),
    });
    setSaving(false);
    toast.success("Menu saved — website updated");
    await onChanged();
  }

  async function toggle() {
    await patchMenu(row.id, { is_enabled: !row.is_enabled });
    await onChanged();
  }

  async function remove() {
    if (!confirm("Delete this package from the website?")) return;
    await removeMenu(row.id);
    toast.success("Deleted");
    await onChanged();
  }

  function patchSection(i: number, next: Section) {
    setSections((prev) => prev.map((s, idx) => (idx === i ? next : s)));
  }

  return (
    <article className="rounded-sm border border-border bg-[#141414] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-[240px] flex-1 gap-2">
          <input className={adminField} value={name} onChange={(e) => setName(e.target.value)} />
          <input className={adminField} placeholder="Badge" value={badge} onChange={(e) => setBadge(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={toggle} className={adminBtn}>
            {row.is_enabled ? "Disable on site" : "Enable on site"}
          </button>
          <button type="button" onClick={remove} className="rounded-sm border border-destructive/40 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.25em] text-destructive">
            Delete
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {sections.map((sec, i) => (
          <div key={i} className="rounded-sm border border-border p-4">
            <div className="flex items-center gap-2">
              <input
                className={adminField}
                value={sec.label}
                onChange={(e) => patchSection(i, { ...sec, label: e.target.value })}
              />
              <button
                type="button"
                className="shrink-0 text-xs text-destructive"
                onClick={() => setSections((prev) => prev.filter((_, idx) => idx !== i))}
              >
                Remove section
              </button>
            </div>
            <textarea
              className={`${adminField} mt-3`}
              rows={6}
              value={sec.items.join("\n")}
              onChange={(e) => patchSection(i, { ...sec, items: e.target.value.split("\n") })}
            />
            <p className="mt-1 text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground">One dish per line</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className={adminBtn}
          onClick={() => setSections((prev) => [...prev, { label: "New section", items: [""] }])}
        >
          Add section
        </button>
        <button type="button" disabled={saving} onClick={save} className={adminPrimary}>
          {saving ? "Saving…" : "Save package"}
        </button>
      </div>
    </article>
  );
}
