import { MessageCircle, Phone, CalendarCheck, MapPin } from "lucide-react";
import { useSiteContent } from "@/hooks/use-site-content";
import { telHref, whatsappHref } from "@/lib/cms-store";

export function FloatingActions() {
  const cms = useSiteContent();
  return (
    <div className="fixed top-1/2 right-4 z-[60] flex -translate-y-1/2 flex-col items-center gap-4 md:right-6">
      <a
        href={whatsappHref(cms.whatsapp, cms.whatsappMessage)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-background/80 text-primary shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-primary/80 hover:bg-primary/10"
      >
        <span className="absolute right-14 hidden whitespace-nowrap rounded-sm border border-primary/40 bg-background/95 px-3 py-2 text-[0.58rem] uppercase tracking-[0.28em] text-primary opacity-0 shadow-lg backdrop-blur transition-opacity group-hover:opacity-100 sm:block">
          WhatsApp
        </span>
        <MessageCircle size={20} />
      </a>

      <a
        href={telHref(cms.phone)}
        aria-label={`Call ${cms.phone}`}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-background/80 text-primary shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-primary/80 hover:bg-primary/10"
      >
        <span className="absolute right-14 hidden whitespace-nowrap rounded-sm border border-primary/40 bg-background/95 px-3 py-2 text-[0.58rem] uppercase tracking-[0.28em] text-primary opacity-0 shadow-lg backdrop-blur transition-opacity group-hover:opacity-100 sm:block">
          Call Now
        </span>
        <Phone size={20} />
      </a>

      <a
        href="#contact"
        aria-label="Reserve your date"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-background/80 text-primary shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-primary/80 hover:bg-primary/10"
      >
        <span className="absolute right-14 hidden whitespace-nowrap rounded-sm border border-primary/40 bg-background/95 px-3 py-2 text-[0.58rem] uppercase tracking-[0.28em] text-primary opacity-0 shadow-lg backdrop-blur transition-opacity group-hover:opacity-100 sm:block">
          Reserve Now
        </span>
        <CalendarCheck size={20} />
      </a>

      <a
        href={cms.mapsDirectionsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="View Excellent Event Planner on Google Maps"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-background/80 text-primary shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-primary/80 hover:bg-primary/10"
      >
        <span className="absolute right-14 hidden whitespace-nowrap rounded-sm border border-primary/40 bg-background/95 px-3 py-2 text-[0.58rem] uppercase tracking-[0.28em] text-primary opacity-0 shadow-lg backdrop-blur transition-opacity group-hover:opacity-100 sm:block">
          Map Location
        </span>
        <MapPin size={20} />
      </a>
    </div>
  );
}
