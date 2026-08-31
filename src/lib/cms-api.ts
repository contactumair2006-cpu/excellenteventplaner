import type { Json } from "@/integrations/supabase/types";
import type { InquiryPayload, InquiryRecord } from "@/lib/inquiries.functions";
import { isSupabaseConfigured } from "@/lib/supabase-env";
import { type CmsContent, mergeCmsContent } from "@/lib/cms-store";
import {
  mutateDb,
  newId,
  readDb,
  type EventRow,
  type FaqRow,
  type GalleryRow,
  type MenuRow,
  type TestimonialRow,
} from "@/lib/local-db";

async function client() {
  const { supabase } = await import("@/integrations/supabase/client");
  return supabase;
}

export async function loadWebsiteContent(): Promise<CmsContent> {
  const local = readDb().content;
  if (!isSupabaseConfigured()) return local;
  try {
    const supabase = await client();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "website_content")
      .maybeSingle();
    if (error || !data?.value || typeof data.value !== "object") return local;
    const merged = mergeCmsContent(data.value as Partial<CmsContent>);
    mutateDb((db) => ({ ...db, content: merged }));
    return merged;
  } catch {
    return local;
  }
}

export async function saveWebsiteContent(content: CmsContent) {
  mutateDb((db) => ({ ...db, content }));
  if (!isSupabaseConfigured()) return { remote: false as const };
  try {
    const supabase = await client();
    const { error } = await supabase.from("site_settings").upsert({
      key: "website_content",
      value: content as unknown as Json,
      updated_at: new Date().toISOString(),
    });
    if (error) return { remote: false as const, message: error.message };
    return { remote: true as const };
  } catch (err) {
    return { remote: false as const, message: err instanceof Error ? err.message : "Sync failed" };
  }
}

export async function listGallery(visibleOnly = false): Promise<GalleryRow[]> {
  const local = () =>
    readDb()
      .gallery.filter((r) => (visibleOnly ? r.is_visible : true))
      .sort((a, b) => a.sort_order - b.sort_order);
  if (!isSupabaseConfigured()) return local();
  try {
    const supabase = await client();
    let q = supabase.from("gallery_images").select("*").order("sort_order");
    if (visibleOnly) q = q.eq("is_visible", true);
    const { data, error } = await q;
    if (error || !data) return local();
    return data as GalleryRow[];
  } catch {
    return local();
  }
}

export async function addGallery(row: Omit<GalleryRow, "id" | "sort_order">) {
  const created: GalleryRow = {
    ...row,
    id: newId("gallery"),
    sort_order: readDb().gallery.length,
  };
  mutateDb((db) => ({ ...db, gallery: [...db.gallery, created] }));
  if (!isSupabaseConfigured()) return created;
  try {
    const supabase = await client();
    const { error } = await supabase.from("gallery_images").insert({
      url: created.url,
      title: created.title,
      description: created.description,
      category: created.category,
      sort_order: created.sort_order,
      is_featured: created.is_featured,
      is_visible: created.is_visible,
    });
    if (error) throw error;
  } catch {
    /* local copy already saved */
  }
  return created;
}

export async function patchGallery(id: string, patch: Partial<GalleryRow>) {
  mutateDb((db) => ({
    ...db,
    gallery: db.gallery.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  }));
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("gallery_images").update(patch).eq("id", id);
  } catch {
    /* keep local */
  }
}

export async function removeGallery(id: string) {
  mutateDb((db) => ({ ...db, gallery: db.gallery.filter((r) => r.id !== id) }));
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("gallery_images").delete().eq("id", id);
  } catch {
    /* keep local */
  }
}

export async function listMenus(enabledOnly = false): Promise<MenuRow[]> {
  const local = () =>
    readDb()
      .menus.filter((r) => (enabledOnly ? r.is_enabled : true))
      .sort((a, b) => a.sort_order - b.sort_order);
  if (!isSupabaseConfigured()) return local();
  try {
    const supabase = await client();
    let q = supabase.from("menu_packages").select("*").order("sort_order");
    if (enabledOnly) q = q.eq("is_enabled", true);
    const { data, error } = await q;
    if (error || !data) return local();
    return data as unknown as MenuRow[];
  } catch {
    return local();
  }
}

export async function addMenu(row: Pick<MenuRow, "name" | "badge">) {
  const created: MenuRow = {
    id: newId("menu"),
    name: row.name,
    badge: row.badge,
    sections: [{ label: "Main Course", items: ["Sample dish"] }],
    sort_order: readDb().menus.length,
    is_featured: false,
    is_enabled: true,
    pdf_url: null,
  };
  mutateDb((db) => ({ ...db, menus: [...db.menus, created] }));
  if (isSupabaseConfigured()) {
    try {
      const supabase = await client();
      await supabase.from("menu_packages").insert({
        name: created.name,
        badge: created.badge,
        sections: created.sections as unknown as Json,
        sort_order: created.sort_order,
        is_enabled: true,
      });
    } catch {
      /* local */
    }
  }
  return created;
}

export async function patchMenu(id: string, patch: Partial<MenuRow>) {
  mutateDb((db) => ({
    ...db,
    menus: db.menus.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  }));
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("menu_packages").update(patch as never).eq("id", id);
  } catch {
    /* local */
  }
}

export async function removeMenu(id: string) {
  mutateDb((db) => ({ ...db, menus: db.menus.filter((r) => r.id !== id) }));
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("menu_packages").delete().eq("id", id);
  } catch {
    /* local */
  }
}

export async function listEvents(visibleOnly = false): Promise<EventRow[]> {
  const local = () =>
    readDb()
      .events.filter((r) => (visibleOnly ? r.is_visible : true))
      .sort((a, b) => a.sort_order - b.sort_order);
  if (!isSupabaseConfigured()) return local();
  try {
    const supabase = await client();
    let q = supabase.from("event_categories").select("*").order("sort_order");
    if (visibleOnly) q = q.eq("is_visible", true);
    const { data, error } = await q;
    if (error || !data) return local();
    return data as EventRow[];
  } catch {
    return local();
  }
}

export async function addEvent(row: Pick<EventRow, "title" | "description" | "image_url">) {
  const created: EventRow = {
    id: newId("event"),
    title: row.title,
    description: row.description,
    image_url: row.image_url,
    sort_order: readDb().events.length,
    is_visible: true,
  };
  mutateDb((db) => ({ ...db, events: [...db.events, created] }));
  if (isSupabaseConfigured()) {
    try {
      const supabase = await client();
      await supabase.from("event_categories").insert({
        title: created.title,
        description: created.description,
        image_url: created.image_url,
        sort_order: created.sort_order,
        is_visible: true,
      });
    } catch {
      /* local */
    }
  }
  return created;
}

export async function patchEvent(id: string, patch: Partial<EventRow>) {
  mutateDb((db) => ({
    ...db,
    events: db.events.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  }));
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("event_categories").update(patch).eq("id", id);
  } catch {
    /* local */
  }
}

export async function removeEvent(id: string) {
  mutateDb((db) => ({ ...db, events: db.events.filter((r) => r.id !== id) }));
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("event_categories").delete().eq("id", id);
  } catch {
    /* local */
  }
}

export async function listTestimonials(approvedOnly = false): Promise<TestimonialRow[]> {
  const local = () =>
    readDb()
      .testimonials.filter((r) => (approvedOnly ? r.is_approved : true))
      .sort((a, b) => a.sort_order - b.sort_order);
  if (!isSupabaseConfigured()) return local();
  try {
    const supabase = await client();
    let q = supabase.from("testimonials").select("*").order("sort_order");
    if (approvedOnly) q = q.eq("is_approved", true);
    const { data, error } = await q;
    if (error || !data) return local();
    return data as TestimonialRow[];
  } catch {
    return local();
  }
}

export async function addTestimonial(row: Pick<TestimonialRow, "quote" | "name" | "event_label" | "rating">) {
  const created: TestimonialRow = {
    id: newId("story"),
    quote: row.quote,
    name: row.name,
    event_label: row.event_label,
    rating: row.rating,
    is_approved: true,
    sort_order: readDb().testimonials.length,
  };
  mutateDb((db) => ({ ...db, testimonials: [...db.testimonials, created] }));
  if (isSupabaseConfigured()) {
    try {
      const supabase = await client();
      await supabase.from("testimonials").insert({
        quote: created.quote,
        name: created.name,
        event_label: created.event_label,
        rating: created.rating,
        is_approved: true,
        sort_order: created.sort_order,
      });
    } catch {
      /* local */
    }
  }
  return created;
}

export async function patchTestimonial(id: string, patch: Partial<TestimonialRow>) {
  mutateDb((db) => ({
    ...db,
    testimonials: db.testimonials.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  }));
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("testimonials").update(patch).eq("id", id);
  } catch {
    /* local */
  }
}

export async function removeTestimonial(id: string) {
  mutateDb((db) => ({ ...db, testimonials: db.testimonials.filter((r) => r.id !== id) }));
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("testimonials").delete().eq("id", id);
  } catch {
    /* local */
  }
}

export async function listFaqs(visibleOnly = false): Promise<FaqRow[]> {
  const local = () =>
    readDb()
      .faqs.filter((r) => (visibleOnly ? r.is_visible : true))
      .sort((a, b) => a.sort_order - b.sort_order);
  if (!isSupabaseConfigured()) return local();
  try {
    const supabase = await client();
    let q = supabase.from("faqs").select("*").order("sort_order");
    if (visibleOnly) q = q.eq("is_visible", true);
    const { data, error } = await q;
    if (error || !data) return local();
    return data as FaqRow[];
  } catch {
    return local();
  }
}

export async function addFaq(question: string, answer: string) {
  const created: FaqRow = {
    id: newId("faq"),
    question,
    answer,
    sort_order: readDb().faqs.length,
    is_visible: true,
  };
  mutateDb((db) => ({ ...db, faqs: [...db.faqs, created] }));
  if (isSupabaseConfigured()) {
    try {
      const supabase = await client();
      await supabase.from("faqs").insert({
        question,
        answer,
        sort_order: created.sort_order,
        is_visible: true,
      });
    } catch {
      /* local */
    }
  }
  return created;
}

export async function patchFaq(id: string, patch: Partial<FaqRow>) {
  mutateDb((db) => ({
    ...db,
    faqs: db.faqs.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  }));
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("faqs").update(patch).eq("id", id);
  } catch {
    /* local */
  }
}

export async function removeFaq(id: string) {
  mutateDb((db) => ({ ...db, faqs: db.faqs.filter((r) => r.id !== id) }));
  if (!isSupabaseConfigured()) return;
  try {
    const supabase = await client();
    await supabase.from("faqs").delete().eq("id", id);
  } catch {
    /* local */
  }
}

export function listLocalInquiries(): InquiryRecord[] {
  return [...readDb().inquiries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function saveLocalInquiry(data: InquiryPayload): InquiryRecord {
  const record: InquiryRecord = {
    id: newId("inq"),
    full_name: data.full_name.trim(),
    phone: data.phone.trim(),
    email: data.email || null,
    event_type: data.event_type,
    event_date: data.event_date || null,
    guest_count: data.guest_count ?? null,
    message: data.message || null,
    selected_package: data.selected_package || null,
    status: "new",
    internal_notes: null,
    created_at: new Date().toISOString(),
  };
  mutateDb((db) => ({ ...db, inquiries: [record, ...db.inquiries] }));
  return record;
}

export function patchLocalInquiry(id: string, patch: Partial<InquiryRecord>) {
  mutateDb((db) => ({
    ...db,
    inquiries: db.inquiries.map((r) => (r.id === id ? { ...r, ...patch } : r)),
  }));
}

export function removeLocalInquiry(id: string) {
  mutateDb((db) => ({ ...db, inquiries: db.inquiries.filter((r) => r.id !== id) }));
}
