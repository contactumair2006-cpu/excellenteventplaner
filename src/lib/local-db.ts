import type { InquiryRecord } from "@/lib/inquiries.functions";
import {
  defaultCmsContent,
  loadCmsContent,
  mergeCmsContent,
  notifyCmsUpdated,
  type CmsContent,
} from "@/lib/cms-store";
import { events, gallery, menus, testimonials, faqs } from "@/lib/venue-content";

const DB_KEY = "eep-local-db-v1";
export const DEFAULT_ADMIN_EMAIL = "bm3595352@gmail.com";
export const DEFAULT_ADMIN_PASSWORD = "Tahirmustafa.1";

export type GalleryRow = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  category: string;
  sort_order: number;
  is_featured: boolean;
  is_visible: boolean;
};

export type MenuRow = {
  id: string;
  name: string;
  badge: string | null;
  sections: { label: string; items: string[] }[];
  sort_order: number;
  is_featured: boolean;
  is_enabled: boolean;
  pdf_url: string | null;
};

export type EventRow = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type TestimonialRow = {
  id: string;
  quote: string;
  name: string;
  event_label: string | null;
  rating: number | null;
  is_approved: boolean;
  sort_order: number;
};

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_visible: boolean;
};

export type LocalDb = {
  content: CmsContent;
  gallery: GalleryRow[];
  menus: MenuRow[];
  events: EventRow[];
  testimonials: TestimonialRow[];
  faqs: FaqRow[];
  inquiries: InquiryRecord[];
  adminEmail: string;
  adminPassword: string;
};

function seedDb(): LocalDb {
  const legacy = typeof window !== "undefined" ? loadCmsContent() : defaultCmsContent();
  return {
    content: mergeCmsContent(legacy),
    gallery: gallery.map((g, i) => ({
      id: `gallery-${i + 1}`,
      url: g.url,
      title: g.title,
      description: null,
      category: g.tag,
      sort_order: i,
      is_featured: i === 0,
      is_visible: true,
    })),
    menus: menus.map((m, i) => ({
      id: `menu-${i + 1}`,
      name: m.name,
      badge: m.badge,
      sections: m.sections,
      sort_order: i,
      is_featured: m.featured,
      is_enabled: true,
      pdf_url: null,
    })),
    events: events.map((e, i) => ({
      id: `event-${i + 1}`,
      title: e.title,
      description: e.text,
      image_url: e.image,
      sort_order: i,
      is_visible: true,
    })),
    testimonials: testimonials.map((t, i) => ({
      id: `story-${i + 1}`,
      quote: t.quote,
      name: t.name,
      event_label: t.event,
      rating: t.rating,
      is_approved: true,
      sort_order: i,
    })),
    faqs: faqs.map((f, i) => ({
      id: `faq-${i + 1}`,
      question: f.q,
      answer: f.a,
      sort_order: i,
      is_visible: true,
    })),
    inquiries: [],
    adminEmail: DEFAULT_ADMIN_EMAIL,
    adminPassword: DEFAULT_ADMIN_PASSWORD,
  };
}

export function readDb(): LocalDb {
  const seeded = seedDb();
  if (typeof window === "undefined") return seeded;
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      localStorage.setItem(DB_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<LocalDb>;
    const legacyEmails = new Set(["admin@royalmarquee.pk", "admin@example.com", "admin@previewstudio.com"]);
    const legacyPasswords = new Set(["Admin@1234", "adminpassword123", "password", "admin", "12345678"]);
    const migratedPassword =
      parsed.adminPassword && !legacyPasswords.has(parsed.adminPassword)
        ? parsed.adminPassword
        : DEFAULT_ADMIN_PASSWORD;
    const migratedEmail =
      parsed.adminEmail && !legacyEmails.has(parsed.adminEmail) && parsed.adminEmail.includes("@")
        ? parsed.adminEmail
        : DEFAULT_ADMIN_EMAIL;

    return {
      ...seeded,
      ...parsed,
      content: mergeCmsContent(parsed.content),
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : seeded.gallery,
      menus: Array.isArray(parsed.menus) ? parsed.menus : seeded.menus,
      events: Array.isArray(parsed.events) ? parsed.events : seeded.events,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : seeded.testimonials,
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : seeded.faqs,
      inquiries: parsed.inquiries ?? [],
      adminEmail: migratedEmail,
      adminPassword: migratedPassword,
    };
  } catch {
    return seeded;
  }
}

export function writeDb(next: LocalDb) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DB_KEY, JSON.stringify(next));
  notifyCmsUpdated();
}

export function mutateDb(fn: (db: LocalDb) => LocalDb) {
  const next = fn(readDb());
  writeDb(next);
  return next;
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
