import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { defaultCmsContent, type CmsContent, type FeatureItem, type StatItem, type VenueItem } from "@/lib/cms-store";
import { loadWebsiteContent, saveWebsiteContent } from "@/lib/cms-api";
import { toast } from "sonner";
import { MediaInput } from "@/components/admin/MediaInput";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
  head: () => ({ meta: [{ title: "Website Content — Admin" }] }),
});

function AdminContent() {
  const [content, setContent] = useState<CmsContent>(defaultCmsContent());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadWebsiteContent().then(setContent);
  }, []);

  function patch<K extends keyof CmsContent>(key: K, value: CmsContent[K]) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const result = await saveWebsiteContent(content);
    setSaving(false);
    toast.success(
      result.remote
        ? "Website content saved and synced"
        : "Website content saved. Open the site to see changes immediately.",
    );
  }

  const field =
    "mt-2 w-full rounded-sm border border-border bg-[#0f0f0f] px-3 py-2 text-sm focus:border-primary focus:outline-none";
  const label = "text-[0.58rem] uppercase tracking-[0.28em] text-muted-foreground";

  return (
    <AdminShell title="Website Content">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Everything here appears on the public website. Save, then refresh the site if a tab is already open.
        </p>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-gold rounded-sm px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.28em] text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-sm border border-border bg-[#141414] p-5">
          <h2 className="font-display text-xl text-gold">Hero</h2>
          <label className={`mt-5 block ${label}`}>Eyebrow</label>
          <input className={field} value={content.heroEyebrow} onChange={(e) => patch("heroEyebrow", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Title line 1</label>
          <input className={field} value={content.heroTitle} onChange={(e) => patch("heroTitle", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Title line 2 (accent)</label>
          <input className={field} value={content.heroTitleAccent} onChange={(e) => patch("heroTitleAccent", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Headline</label>
          <input className={field} value={content.heroHeadline} onChange={(e) => patch("heroHeadline", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Supporting text</label>
          <textarea className={field} rows={3} value={content.heroSub} onChange={(e) => patch("heroSub", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Hero image</label>
          <div className="mt-2">
            <MediaInput value={content.heroImage} onChange={(v) => patch("heroImage", v)} />
          </div>
          <label className={`mt-4 block ${label}`}>Logo</label>
          <div className="mt-2">
            <MediaInput value={content.logoUrl} onChange={(v) => patch("logoUrl", v)} />
          </div>
          <label className={`mt-4 block ${label}`}>Tagline</label>
          <input className={field} value={content.tagline} onChange={(e) => patch("tagline", e.target.value)} />
        </section>

        <section className="rounded-sm border border-border bg-[#141414] p-5">
          <h2 className="font-display text-xl text-gold">About</h2>
          <label className={`mt-5 block ${label}`}>Heading</label>
          <textarea className={field} rows={2} value={content.aboutHeading} onChange={(e) => patch("aboutHeading", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Paragraph 1</label>
          <textarea className={field} rows={3} value={content.aboutBody1} onChange={(e) => patch("aboutBody1", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Paragraph 2</label>
          <textarea className={field} rows={3} value={content.aboutBody2} onChange={(e) => patch("aboutBody2", e.target.value)} />
        </section>

        <section className="rounded-sm border border-border bg-[#141414] p-5">
          <h2 className="font-display text-xl text-gold">Contact Information</h2>
          <label className={`mt-5 block ${label}`}>Primary phone</label>
          <input className={field} value={content.phone} onChange={(e) => patch("phone", e.target.value)} />
          <label className={`mt-4 block ${label}`}>All phones (one per line)</label>
          <textarea
            className={field}
            rows={3}
            value={content.phones.join("\n")}
            onChange={(e) => patch("phones", e.target.value.split("\n").map((v) => v.trim()).filter(Boolean))}
          />
          <label className={`mt-4 block ${label}`}>WhatsApp (digits, country code)</label>
          <input className={field} value={content.whatsapp} onChange={(e) => patch("whatsapp", e.target.value)} />
          <label className={`mt-4 block ${label}`}>WhatsApp default message</label>
          <textarea className={field} rows={2} value={content.whatsappMessage} onChange={(e) => patch("whatsappMessage", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Email</label>
          <input className={field} value={content.email} onChange={(e) => patch("email", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Hours</label>
          <input className={field} value={content.hours} onChange={(e) => patch("hours", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Address</label>
          <textarea className={field} rows={3} value={content.address} onChange={(e) => patch("address", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Short address</label>
          <input className={field} value={content.addressShort} onChange={(e) => patch("addressShort", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Google Maps embed URL</label>
          <input className={field} value={content.mapsEmbedUrl} onChange={(e) => patch("mapsEmbedUrl", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Directions URL</label>
          <input className={field} value={content.mapsDirectionsUrl} onChange={(e) => patch("mapsDirectionsUrl", e.target.value)} />
        </section>

        <section className="rounded-sm border border-border bg-[#141414] p-5">
          <h2 className="font-display text-xl text-gold">SEO</h2>
          <label className={`mt-5 block ${label}`}>Meta title</label>
          <input className={field} value={content.metaTitle} onChange={(e) => patch("metaTitle", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Meta description</label>
          <textarea className={field} rows={3} value={content.metaDescription} onChange={(e) => patch("metaDescription", e.target.value)} />
          <label className={`mt-4 block ${label}`}>Keywords</label>
          <input className={field} value={content.keywords} onChange={(e) => patch("keywords", e.target.value)} />
        </section>
      </div>

      <section className="mt-6 rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Feature bar</h2>
        <FeatureList items={content.featureBar} onChange={(items) => patch("featureBar", items)} />
      </section>

      <section className="mt-6 rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">About stats</h2>
        <StatList items={content.stats} onChange={(items) => patch("stats", items)} />
      </section>

      <section className="mt-6 rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Venue spaces</h2>
        <p className="mt-2 text-xs text-muted-foreground">These cards appear in About photos and the Venue section.</p>
        <VenueList items={content.venues} onChange={(items) => patch("venues", items)} />
      </section>

      <section className="mt-6 rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Why choose us</h2>
        <FeatureList items={content.whyChoose} onChange={(items) => patch("whyChoose", items)} />
      </section>

      <section className="mt-6 rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Booking timeline</h2>
        <TimelineList items={content.timeline} onChange={(items) => patch("timeline", items)} />
      </section>

      <section className="mt-6 rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Cinematic & banner</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Cinematic video URL (.mp4)</label>
            <input className={field} value={content.cinematicVideo} onChange={(e) => patch("cinematicVideo", e.target.value)} />
            <label className={`mt-4 block ${label}`}>Cinematic poster image URL</label>
            <input className={field} value={content.cinematicImage} onChange={(e) => patch("cinematicImage", e.target.value)} />
            <label className={`mt-4 block ${label}`}>Cinematic eyebrow</label>
            <input className={field} value={content.cinematicEyebrow} onChange={(e) => patch("cinematicEyebrow", e.target.value)} />
            <label className={`mt-4 block ${label}`}>Cinematic title</label>
            <input className={field} value={content.cinematicTitle} onChange={(e) => patch("cinematicTitle", e.target.value)} />
          </div>
          <div>
            <label className={label}>Banner image URL</label>
            <input className={field} value={content.bannerImage} onChange={(e) => patch("bannerImage", e.target.value)} />
            <label className={`mt-4 block ${label}`}>Banner eyebrow</label>
            <input className={field} value={content.bannerEyebrow} onChange={(e) => patch("bannerEyebrow", e.target.value)} />
            <label className={`mt-4 block ${label}`}>Banner title</label>
            <input className={field} value={content.bannerTitle} onChange={(e) => patch("bannerTitle", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Additional menu selections</h2>
        <textarea
          className={`${field} mt-3`}
          rows={8}
          value={content.additionalSelection.join("\n")}
          onChange={(e) =>
            patch(
              "additionalSelection",
              e.target.value
                .split("\n")
                .map((v) => v.trim())
                .filter(Boolean),
            )
          }
        />
      </section>
    </AdminShell>
  );
}

const field =
  "mt-2 w-full rounded-sm border border-border bg-[#0f0f0f] px-3 py-2 text-sm focus:border-primary focus:outline-none";

function FeatureList({ items, onChange }: { items: FeatureItem[]; onChange: (items: FeatureItem[]) => void }) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((item, i) => (
        <div key={i} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
          <input className={field} value={item.title} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))} />
          <input className={field} value={item.text} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, text: e.target.value } : x)))} />
          <button type="button" className="text-xs text-destructive" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-xs uppercase tracking-[0.2em] text-primary"
        onClick={() => onChange([...items, { title: "New item", text: "Description" }])}
      >
        + Add item
      </button>
    </div>
  );
}

function StatList({ items, onChange }: { items: StatItem[]; onChange: (items: StatItem[]) => void }) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((item, i) => (
        <div key={i} className="grid gap-3 md:grid-cols-[120px_1fr_auto]">
          <input className={field} value={item.value} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)))} />
          <input className={field} value={item.label} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))} />
          <button type="button" className="text-xs text-destructive" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-xs uppercase tracking-[0.2em] text-primary"
        onClick={() => onChange([...items, { value: "0", label: "New stat" }])}
      >
        + Add stat
      </button>
    </div>
  );
}

function VenueList({ items, onChange }: { items: VenueItem[]; onChange: (items: VenueItem[]) => void }) {
  return (
    <div className="mt-4 space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-sm border border-border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <input className={field} placeholder="Name" value={item.name} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))} />
            <input className={field} placeholder="Label" value={item.capacity} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, capacity: e.target.value } : x)))} />
            <input className={`${field} md:col-span-2`} placeholder="Image URL" value={item.image} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, image: e.target.value } : x)))} />
            <textarea className={`${field} md:col-span-2`} rows={2} placeholder="Description" value={item.blurb} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, blurb: e.target.value } : x)))} />
          </div>
          <button type="button" className="mt-3 text-xs text-destructive" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            Remove space
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-xs uppercase tracking-[0.2em] text-primary"
        onClick={() => onChange([...items, { name: "New space", capacity: "Venue", image: "/images/r1.png", blurb: "Describe this space." }])}
      >
        + Add venue space
      </button>
    </div>
  );
}

function TimelineList({
  items,
  onChange,
}: {
  items: CmsContent["timeline"];
  onChange: (items: CmsContent["timeline"]) => void;
}) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((item, i) => (
        <div key={i} className="grid gap-3 md:grid-cols-[80px_1fr_2fr_auto]">
          <input className={field} value={item.step} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, step: e.target.value } : x)))} />
          <input className={field} value={item.title} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))} />
          <input className={field} value={item.text} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, text: e.target.value } : x)))} />
          <button type="button" className="text-xs text-destructive" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-xs uppercase tracking-[0.2em] text-primary"
        onClick={() => onChange([...items, { step: String(items.length + 1).padStart(2, "0"), title: "New step", text: "Details" }])}
      >
        + Add step
      </button>
    </div>
  );
}
