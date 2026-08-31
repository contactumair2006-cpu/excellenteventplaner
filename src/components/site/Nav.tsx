import { useEffect, useState } from "react";
import { Menu, X, Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { logoUrl } from "@/lib/venue-content";
import { useSiteContent } from "@/hooks/use-site-content";
import { telHref, whatsappHref } from "@/lib/cms-store";

const links = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#venue", label: "Venue" },
  { href: "#events", label: "Events" },
  { href: "#menu", label: "Menu & Catering" },
  { href: "#gallery", label: "Gallery" },
  { href: "#stories", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const cms = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/90 py-3 backdrop-blur-xl"
          : "border-b border-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 md:px-10">
        <a href="#top" className="flex items-center gap-3">
          <img
            src={cms.logoUrl || logoUrl}
            alt={`${cms.heroTitle} ${cms.heroTitleAccent}`}
            width={56}
            height={56}
            className="h-12 w-12 rounded-full object-cover ring-1 ring-primary/40 md:h-14 md:w-14"
          />
          <div className="flex flex-col">
            <span className="font-display text-xl leading-none tracking-[0.1em] text-primary md:text-2xl">
              {cms.heroTitle || "Excellent"}
            </span>
            <span className="font-display text-base leading-none tracking-[0.2em] text-primary/80 md:text-lg">
              {cms.heroTitleAccent || "Event Planner"}
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 xl:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <a
            href={telHref(cms.phone)}
            aria-label="Call Excellent Event Planner"
            className="hidden rounded-full border border-primary/50 p-3 text-primary transition-colors hover:bg-primary/10 md:inline-flex"
          >
            <Phone size={18} />
          </a>
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-sm bg-[#e8c686] px-6 py-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] transition-opacity hover:opacity-90 lg:inline-flex"
          >
            <CalendarCheck size={16} />
            Check Availability
          </a>
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="text-primary xl:hidden"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-background/98 px-6 py-8 backdrop-blur-xl xl:hidden">
          <div className="flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-6">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="bg-gold rounded-sm px-6 py-3 text-center text-[0.62rem] uppercase tracking-[0.3em] text-primary-foreground"
              >
                Check Availability
              </a>
              <a
                href={whatsappHref(cms.whatsapp, cms.whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-primary/50 px-6 py-3 text-center text-[0.62rem] uppercase tracking-[0.3em] text-primary"
              >
                WhatsApp
              </a>
              <a
                href={telHref(cms.phone)}
                className="rounded-sm border border-border px-6 py-3 text-center text-[0.62rem] uppercase tracking-[0.3em] text-muted-foreground"
              >
                Call {cms.phone}
              </a>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
