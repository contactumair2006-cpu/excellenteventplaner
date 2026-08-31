import {
  additionalSelection,
  brand,
  faqs,
  heroImage,
  logoUrl,
  timeline,
  venues,
  whyChoose,
} from "@/lib/venue-content";

export const CMS_EVENT = "eep-cms-updated";
const LEGACY_STORAGE_KEY = "royal-marquee-cms-v1";

export type FeatureItem = { title: string; text: string };
export type StatItem = { icon?: string; value: string; label: string };
export type VenueItem = { name: string; capacity: string; image: string; blurb: string };
export type TimelineItem = { step: string; title: string; text: string };

export type CmsContent = {
  heroTitle: string;
  heroTitleAccent: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSub: string;
  heroImage: string;
  logoUrl: string;
  tagline: string;
  aboutHeading: string;
  aboutBody1: string;
  aboutBody2: string;
  stats: StatItem[];
  hours: string;
  phone: string;
  phones: string[];
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  address: string;
  addressShort: string;
  mapsEmbedUrl: string;
  mapsDirectionsUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  featureBar: FeatureItem[];
  venues: VenueItem[];
  whyChoose: FeatureItem[];
  timeline: TimelineItem[];
  additionalSelection: string[];
  faqs: { q: string; a: string }[];
  cinematicImage: string;
  cinematicVideo: string;
  cinematicEyebrow: string;
  cinematicTitle: string;
  bannerImage: string;
  bannerEyebrow: string;
  bannerTitle: string;
};

export function defaultCmsContent(): CmsContent {
  return {
    heroTitle: "Excellent",
    heroTitleAccent: "Event Planner",
    heroEyebrow: "Taxila · Faisal Hills · Main G.T. Road",
    heroHeadline: brand.heroHeadline,
    heroSub: brand.heroSub,
    heroImage,
    logoUrl,
    tagline: brand.tagline,
    aboutHeading: "Redefining Luxury\nCelebrations",
    aboutBody1:
      "At Excellent Event Planner, we believe every celebration deserves perfection. From intimate gatherings to grand affairs, our venue, services and hospitality are designed to create unforgettable experiences that you and your guests will cherish forever.",
    aboutBody2:
      "Located on Main G-T Road near Faisal Hills, Taxila, we combine refined ambience, premium catering and personalized planning.",
    stats: [
      { value: "10+", label: "Years of Excellence" },
      { value: "1000+", label: "Events Hosted" },
      { value: "100%", label: "Client Satisfaction" },
      { value: "5★", label: "Client Rating" },
    ],
    hours: brand.hours,
    phone: brand.phone,
    phones: [...brand.phones],
    whatsapp: brand.whatsapp,
    whatsappMessage: brand.whatsappMessage,
    email: brand.email,
    address: brand.address,
    addressShort: brand.addressShort,
    mapsEmbedUrl: brand.mapsEmbedUrl,
    mapsDirectionsUrl: brand.mapsDirectionsUrl,
    metaTitle: "Excellent Event Planner — Luxury Wedding & Event Venue in Taxila | Rawalpindi",
    metaDescription:
      "Premium wedding and event venue on Main G-T Road, Faisal Hills, Taxila. Check availability and book a visit.",
    keywords: "Excellent Event Planner, wedding venue Taxila, Faisal Hills, GT Road marquee",
    featureBar: [
      { title: "Premium Venue", text: "Elegant spaces designed for luxury & comfort" },
      { title: "Exquisite Catering", text: "Gourmet menus crafted by expert chefs" },
      { title: "Memorable Events", text: "Every detail tailored for a perfect celebration" },
      { title: "Professional Staff", text: "Dedicated team ensuring seamless experiences" },
      { title: "Trust & Excellence", text: "Commitment to quality & client satisfaction" },
    ],
    venues: venues.map(({ name, capacity, image, blurb }) => ({ name, capacity, image, blurb })),
    whyChoose: [...whyChoose],
    timeline: [...timeline],
    additionalSelection: [...additionalSelection],
    faqs: [...faqs],
    cinematicImage: "/images/gold_stage_new.png",
    cinematicVideo: "/videos/function_highlights.mp4",
    cinematicEyebrow: "The Experience",
    cinematicTitle: "Moments, Immortalised",
    bannerImage: "/images/gold_stage.jpg",
    bannerEyebrow: "Let Us Make Your Event",
    bannerTitle: "Extraordinary",
  };
}

export function mergeCmsContent(partial?: Partial<CmsContent> | null): CmsContent {
  const defaults = defaultCmsContent();
  if (!partial || typeof partial !== "object") return defaults;
  const isOldAddress = !partial.address || partial.address.includes("Excellent Event Planner, Faisal Hills");
  return {
    ...defaults,
    ...partial,
    address: isOldAddress || !partial.address ? defaults.address : partial.address,
    addressShort: isOldAddress || !partial.addressShort ? defaults.addressShort : partial.addressShort,
    mapsEmbedUrl: isOldAddress || !partial.mapsEmbedUrl ? defaults.mapsEmbedUrl : partial.mapsEmbedUrl,
    mapsDirectionsUrl: isOldAddress || !partial.mapsDirectionsUrl ? defaults.mapsDirectionsUrl : partial.mapsDirectionsUrl,
    phones: partial.phones?.length ? partial.phones : defaults.phones,
    stats: partial.stats?.length ? partial.stats : defaults.stats,
    featureBar: partial.featureBar?.length ? partial.featureBar : defaults.featureBar,
    venues: partial.venues?.length ? partial.venues : defaults.venues,
    whyChoose: partial.whyChoose?.length ? partial.whyChoose : defaults.whyChoose,
    timeline: partial.timeline?.length ? partial.timeline : defaults.timeline,
    additionalSelection: partial.additionalSelection?.length
      ? partial.additionalSelection
      : defaults.additionalSelection,
    faqs: partial.faqs?.length ? partial.faqs : defaults.faqs,
  };
}

export function loadCmsContent(): CmsContent {
  if (typeof window === "undefined") return defaultCmsContent();
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return defaultCmsContent();
    return mergeCmsContent(JSON.parse(raw));
  } catch {
    return defaultCmsContent();
  }
}

export function saveCmsContent(content: CmsContent) {
  localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event(CMS_EVENT));
}

export function notifyCmsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CMS_EVENT));
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(whatsapp: string, message: string) {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
