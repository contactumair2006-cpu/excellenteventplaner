import { useEffect, useState } from "react";
import { CMS_EVENT } from "@/lib/cms-store";
import {
  listEvents,
  listFaqs,
  listGallery,
  listMenus,
  listTestimonials,
} from "@/lib/cms-api";
import { readDb, type EventRow, type FaqRow, type GalleryRow, type MenuRow, type TestimonialRow } from "@/lib/local-db";

function useLiveList<T>(load: () => Promise<T[]>, initial: T[]) {
  const [rows, setRows] = useState<T[]>(initial);
  useEffect(() => {
    const refresh = () => {
      void load().then(setRows);
    };
    refresh();
    window.addEventListener(CMS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CMS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [load]);
  return rows;
}

const loadGallery = () => listGallery(true);
const loadMenus = () => listMenus(true);
const loadEvents = () => listEvents(true);
const loadTestimonials = () => listTestimonials(true);
const loadFaqs = () => listFaqs(true);

export function usePublicGallery() {
  return useLiveList<GalleryRow>(loadGallery, typeof window === "undefined" ? [] : readDb().gallery.filter((g) => g.is_visible));
}

export function usePublicMenus() {
  return useLiveList<MenuRow>(loadMenus, typeof window === "undefined" ? [] : readDb().menus.filter((m) => m.is_enabled));
}

export function usePublicEvents() {
  return useLiveList<EventRow>(loadEvents, typeof window === "undefined" ? [] : readDb().events.filter((e) => e.is_visible));
}

export function usePublicTestimonials() {
  return useLiveList<TestimonialRow>(
    loadTestimonials,
    typeof window === "undefined" ? [] : readDb().testimonials.filter((t) => t.is_approved),
  );
}

export function usePublicFaqs() {
  return useLiveList<FaqRow>(loadFaqs, typeof window === "undefined" ? [] : readDb().faqs.filter((f) => f.is_visible));
}
