import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Mail, Clock, Crown, MessageCircle, Navigation, Diamond, ConciergeBell, CalendarDays, Users, ShieldCheck, Mouse, ChevronDown, Award, Star, ChefHat, Headset, Play, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Nav } from "@/components/site/Nav";
import { Gallery } from "@/components/site/Gallery";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { Preloader } from "@/components/site/Preloader";
import { FloatingActions } from "@/components/site/FloatingActions";
import { MenuShowcase } from "@/components/site/MenuShowcase";
import { useSiteContent } from "@/hooks/use-site-content";
import { usePublicEvents, usePublicFaqs, usePublicTestimonials } from "@/hooks/use-site-collections";
import { telHref, whatsappHref } from "@/lib/cms-store";
import { menuCardUrl } from "@/lib/venue-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Excellent Event Planner — Luxury Wedding & Event Venue in Taxila | Rawalpindi",
      },
      {
        name: "description",
        content:
          "Excellent Event Planner is a premium wedding and event venue on Main G-T Road, Faisal Hills, Taxila. Host weddings, walima, mehndi and corporate events with elegant décor and royal catering.",
      },
      {
        property: "og:title",
        content: "Excellent Event Planner — Where Every Celebration Deserves a Royal Experience",
      },
      {
        property: "og:description",
        content:
          "Premium marquee venue in Taxila near Faisal Hills. Check availability, view menus and book a visit today.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "/images/gold_stage_new.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "/images/gold_stage_new.png",
      },
      { name: "keywords", content: "Excellent Event Planner, wedding venue Taxila, Faisal Hills, GT Road marquee, Rawalpindi wedding hall" },
    ],
  }),
  component: Index,
});

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const cms = useSiteContent();
  const trustBar = cms.featureBar;
  const whyChoose = cms.whyChoose;
  const timeline = cms.timeline;
  const heroHeadline = cms.heroHeadline;
  const heroSub = cms.heroSub;
  const address = cms.address;
  const mapsEmbedUrl = cms.mapsEmbedUrl;
  const mapsDirectionsUrl = cms.mapsDirectionsUrl;
  const phones = cms.phones?.length ? cms.phones : [cms.phone];
  const email = cms.email;
  const venues = cms.venues;
  const heroImage = cms.heroImage;
  const logoUrl = cms.logoUrl;
  const dbEvents = usePublicEvents();
  const dbTestimonials = usePublicTestimonials();
  const dbFaqs = usePublicFaqs();

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EventVenue",
            name: "Excellent Event Planner",
            description: heroSub,
            telephone: cms.phone,
            email,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Faisal Hills Block-A Markaz, Main G-T Road",
              addressLocality: "Taxila",
              addressRegion: "Punjab",
              addressCountry: "PK",
            },
            url: "https://royalmarquee.pk",
            image: heroImage,
            geo: {
              "@type": "GeoCoordinates",
              plusCode: "PQ6P+4XG",
            },
          }),
        }}
      />
      {videoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">
          <button
            onClick={() => setVideoModalOpen(false)}
            className="absolute right-6 top-6 text-white/70 transition-colors hover:text-white"
          >
            <X size={32} />
          </button>
          <div className="w-full max-w-6xl px-4">
            <video
              src={cms.cinematicVideo || "/videos/function_highlights.mp4"}
              controls
              autoPlay
              className="w-full rounded-sm border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      )}
      <Preloader />
      <Nav />
      <FloatingActions />

      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-background">
        {/* Full-bleed venue imagery with cinematic gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Excellent Event Planner Venue"
            className="h-full w-full object-cover hero-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pt-32 pb-20 md:px-10 md:pt-40">
          <div className="max-w-2xl">
            <Reveal>
              <div className="flex items-center gap-3 text-primary">
                <span className="h-px w-10 bg-primary/60" />
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] md:tracking-[0.45em]">
                  {cms.heroEyebrow}
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-8 font-display text-5xl leading-[1.05] tracking-tight text-foreground drop-shadow-xl md:text-7xl lg:text-8xl">
                {cms.heroTitle}<br />
                <span className="italic text-primary">{cms.heroTitleAccent}</span>
              </h1>
              <div className="mt-8 h-[2px] w-24 bg-gradient-to-r from-primary to-transparent" />
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 max-w-xl font-display text-2xl leading-snug text-foreground/90 md:text-3xl">
                {heroHeadline}
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/80 drop-shadow-md md:text-lg">
                {heroSub}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-primary-foreground shadow-[0_10px_40px_-10px] shadow-primary/40 transition-all hover:-translate-y-0.5 hover:shadow-primary/60"
                >
                  Check Availability <CalendarDays size={14} className="ml-2" />
                </a>
                <a
                  href="#venue"
                  className="inline-flex items-center justify-center rounded-sm border border-primary/40 bg-card/40 px-8 py-4 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-foreground backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  Explore Spaces <span className="ml-2">›</span>
                </a>
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="group inline-flex items-center justify-center gap-3 rounded-sm border border-foreground/20 bg-foreground/5 px-8 py-4 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-foreground backdrop-blur-md transition-all hover:border-foreground/40 hover:bg-foreground/10"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Play size={10} className="ml-0.5" />
                  </span>
                  Watch Venue Video
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={400} className="mt-20">
            <a
              href="#features"
              className="group flex max-w-max flex-col items-center gap-2 text-primary/70 transition-colors hover:text-primary"
              aria-label="Scroll to discover"
            >
              <div className="flex items-center gap-2">
                <Mouse size={16} className="scroll-pulse" />
                <span className="text-[0.6rem] uppercase tracking-[0.3em]">Scroll to Discover</span>
              </div>
              <ChevronDown size={14} className="scroll-pulse group-hover:text-primary" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* FEATURES BAR */}
      <section id="features" className="relative z-20 border-y border-border bg-card/60 backdrop-blur-md">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-y divide-border md:grid-cols-5 md:divide-y-0">
          {trustBar.map((item, i) => {
            const icons = [Diamond, ConciergeBell, CalendarDays, Users, ShieldCheck];
            const Icon = icons[i % icons.length] || Diamond;
            return (
            <Reveal key={item.title} delay={i * 80} className="flex flex-col items-center px-6 py-10 text-center">
              <div className="mb-4 rounded-full border border-primary/30 p-4 text-primary">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg uppercase tracking-widest text-primary/90">{item.title}</h3>
              <p className="mt-2 text-[0.65rem] leading-relaxed text-muted-foreground uppercase tracking-[0.1em]">
                {item.text}
              </p>
            </Reveal>
            );
          })}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          
          <div>
            <Reveal>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-primary/90">About Us</p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl text-foreground whitespace-pre-line">
                {cms.aboutHeading}
              </h2>
              <div className="h-[2px] w-16 bg-primary/70 mt-6" />
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base max-w-lg">
                {cms.aboutBody1}
              </p>
              
              <div className="mt-10 grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-4">
                {cms.stats.map((stat, i) => {
                  const icons = [Star, CalendarDays, Users, Award];
                  const Icon = icons[i % icons.length] || Star;
                  return (
                  <div key={stat.label} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Icon size={18} className="text-primary" />
                      <span className="font-display text-2xl font-bold text-foreground">{stat.value}</span>
                    </div>
                    <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                  </div>
                  );
                })}
              </div>
              
              <a
                href="#venue"
                className="mt-12 inline-block rounded-sm border border-primary/50 px-8 py-4 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-primary transition-colors hover:bg-primary/10"
              >
                Discover More About Us <span className="ml-2">›</span>
              </a>
            </Reveal>
          </div>

          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              {/* Photo 1: Grand Illuminated Entrance */}
              <div className="aspect-square rounded-md border border-primary/30 overflow-hidden shadow-luxe p-1 bg-background/50 backdrop-blur-sm group relative">
                <img
                  src="/images/royal_marquee_entrance.jpg"
                  alt="Royal Marquee Grand Illuminated Entrance"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-sm opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <p className="text-[0.6rem] font-medium text-white tracking-wider">Grand Illuminated Entrance</p>
                </div>
              </div>

              {/* Photo 2: Luxury Classical Stage */}
              <div className="aspect-square rounded-md border border-primary/30 overflow-hidden shadow-luxe p-1 bg-background/50 backdrop-blur-sm group relative">
                <img
                  src="/images/royal_marquee_stage.jpg"
                  alt="Royal Marquee Bridal Stage"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-sm opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <p className="text-[0.6rem] font-medium text-white tracking-wider">Royal Floral Pavilion</p>
                </div>
              </div>

              {/* Photo 3: Gold Stage Chandelier */}
              <div className="aspect-square rounded-md border border-primary/30 overflow-hidden shadow-luxe p-1 bg-background/50 backdrop-blur-sm group relative">
                <img
                  src="/images/gold_stage.jpg"
                  alt="Gold Stage and Chandelier Setup"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-sm opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <p className="text-[0.6rem] font-medium text-white tracking-wider">Gold Chandelier Stage</p>
                </div>
              </div>

              {/* Photo 4: Ivory and Gold Grand Stage */}
              <div className="aspect-square rounded-md border border-primary/30 overflow-hidden shadow-luxe p-1 bg-background/50 backdrop-blur-sm group relative">
                <img
                  src="/images/s3.png"
                  alt="Ivory and Gold Grand Stage"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-sm opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <p className="text-[0.6rem] font-medium text-white tracking-wider">Ivory & Gold Grand Stage</p>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* VENUE SHOWCASE */}
      <section id="venue" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
        <SectionHeading
          eyebrow="The Venue"
          title="An Experience Beyond a Venue"
          subtitle="Immersive spaces crafted for grand entrances, elegant décor, dining and celebration — showcased through the real Excellent Event Planner."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {venues.map((v, i) => (
            <Reveal key={v.name} delay={i * 100} className={i === 0 ? "md:col-span-2" : ""}>
              <article className="group relative overflow-hidden rounded-sm border border-border bg-black shadow-luxe">
                <img
                  src={v.image}
                  alt={v.name}
                  loading="lazy"
                  className={`w-full object-cover transition-all duration-[1400ms] group-hover:scale-105 opacity-65 group-hover:opacity-80 ${
                    i === 0 ? "h-[380px] md:h-[520px]" : "h-[320px]"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-brand drop-shadow-md">{v.capacity}</p>
                  <h3 className="mt-3 font-display text-4xl text-[white] md:text-5xl">{v.name}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[white]/95 md:text-base">{v.blurb}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="border-y border-border bg-card/30 py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeading
            eyebrow="Celebrations"
            title="Events We Host"
            subtitle="From intimate gatherings to grand weddings — every occasion is planned with elegance and care."
          />
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dbEvents.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 70}>
                <article className="group h-full overflow-hidden rounded-sm border border-primary/20 bg-card/60 shadow-luxe transition-all hover:border-primary/50 hover:bg-card">
                  <div className="overflow-hidden">
                    <img
                      src={ev.image_url || "/images/r1.png"}
                      alt={ev.title}
                      loading="lazy"
                      className="h-56 w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-display text-3xl text-brand">{ev.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/80">{ev.description}</p>
                    <a
                      href="#contact"
                      className="mt-6 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary transition-colors hover:text-foreground"
                    >
                      Request a Quote <span className="text-brand">→</span>
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CINEMATIC FEATURE */}
      <section className="relative border-b border-border min-h-[60vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden bg-black">
        <video
          src={cms.cinematicVideo || "/videos/function_highlights.mp4"}
          poster={cms.cinematicImage || "/images/gold_stage_new.png"}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-background/70" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-black/60 px-4 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.35em] text-primary backdrop-blur-md">
              <Play size={12} className="fill-primary" /> {cms.cinematicEyebrow}
            </span>
            <h2 className="mt-6 font-display text-4xl text-white drop-shadow-xl md:text-6xl lg:text-7xl">
              {cms.cinematicTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              Experience our grand halls, mesmerizing lighting, and extraordinary celebrations captured in motion.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-primary-foreground shadow-[0_0_30px_rgba(200,168,107,0.4)] transition-all hover:scale-105"
              >
                Reserve Your Date
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-sm border border-white/30 bg-black/40 px-8 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Book a Visit
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
        <SectionHeading
          eyebrow="Menu & Catering"
          title="An Exclusive Culinary Experience"
          subtitle="Signature packages and additional selections — presented as a luxury event catering experience, fully customizable for your celebration."
        />
        <Reveal className="mx-auto mt-12 max-w-xl">
          <img
            src={menuCardUrl}
            alt="Excellent Event Planner catering menu"
            loading="lazy"
            className="w-full rounded-sm border border-primary/30 object-cover shadow-[0_30px_80px_-40px_rgba(0,0,0,0.85)]"
          />
        </Reveal>
        <MenuShowcase />
        <Reveal className="mt-10 text-center">
          <a
            href="#contact"
            className="inline-block rounded-sm border border-primary/50 px-8 py-3.5 text-[0.62rem] uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View Menu · Request a Quote
          </a>
        </Reveal>
      </section>

      <section className="border-y border-border bg-secondary py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeading
            eyebrow="Why Excellent Event Planner"
            title="Your Moments Deserve a Royal Setting"
            subtitle="Five pillars that define every celebration we host."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <div className="bg-card border border-border p-8 rounded-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300">
                  <p className="font-display text-5xl text-primary/20 font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
        <SectionHeading
          eyebrow="Portfolio"
          title="Luxury Gallery"
          subtitle="Authentic photographs from celebrations at Excellent Event Planner."
        />
        <Gallery />
      </section>

      {/* TIMELINE */}
      <section className="border-y border-border bg-card/30 py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeading
            eyebrow="Your Journey"
            title="From Inquiry to Celebration"
            subtitle="A clear, elegant path to your special day."
          />
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t, i) => (
              <Reveal key={t.step} delay={i * 100}>
                <div className="relative">
                  <p className="font-display text-6xl text-primary/30">{t.step}</p>
                  <div className="hairline mt-4 w-16" />
                  <h3 className="mt-5 font-display text-2xl text-foreground">{t.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 text-center">
            <a
              href="#contact"
              className="bg-brand inline-block rounded-sm px-10 py-4 text-[0.62rem] uppercase tracking-[0.32em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Book a Visit
            </a>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="stories" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
        <SectionHeading
          eyebrow="Testimonials"
          title="Guest Stories"
          subtitle="Demo testimonials shown for presentation — replace with approved client reviews from the admin panel."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {dbTestimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 110}>
              <figure className="h-full rounded-sm border border-border bg-card/40 p-9">
                <p className="font-display text-6xl leading-none text-primary/30">“</p>
                <blockquote className="mt-3 text-sm leading-loose text-muted-foreground">
                  {t.quote}
                </blockquote>
                <div className="mt-5 flex gap-1 text-primary">
                  {Array.from({ length: t.rating || 5 }).map((_, si) => (
                    <span key={si} className="text-xs">
                      ★
                    </span>
                  ))}
                </div>
                <figcaption className="mt-6">
                  <p className="font-display text-xl text-brand">{t.name}</p>
                  <p className="mt-1 text-[0.58rem] uppercase tracking-[0.28em] text-muted-foreground">
                    {t.event_label}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-y border-border bg-card/30 py-24 md:py-28">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <SectionHeading eyebrow="FAQ" title="Questions, Answered" />
          <Reveal className="mt-12">
            <Accordion type="single" collapsible className="w-full">
              {dbFaqs.map((f, i) => (
                <AccordionItem key={f.id} value={`faq-${i}`} className="border-border">
                  <AccordionTrigger className="text-left font-display text-lg text-foreground hover:no-underline hover:text-primary md:text-xl">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* BOOKING */}
      <section id="contact" className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-28">
        <SectionHeading
          eyebrow="Plan Your Celebration"
          title="Plan Your Celebration with Excellent Event Planner"
          subtitle="Share a few details and our team will confirm availability and guide you through the next steps."
        />
        <div className="mt-16 grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-7">
              <div className="flex items-start gap-4">
                <span className="mt-1 rounded-sm border border-primary/40 p-3 text-primary">
                  <MapPin size={16} />
                </span>
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.35em] text-muted-foreground">
                    Location
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground md:text-base">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-1 rounded-sm border border-primary/40 p-3 text-primary">
                  <Phone size={16} />
                </span>
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.35em] text-muted-foreground">
                    Call Us
                  </p>
                  <div className="mt-2 space-y-1">
                    {phones.map((p) => (
                      <a
                        key={p}
                        href={`tel:${p.replace(/\s/g, "")}`}
                        className="block text-base text-foreground transition-colors hover:text-primary"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-1 rounded-sm border border-primary/40 p-3 text-primary">
                  <Mail size={16} />
                </span>
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.35em] text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-2 block text-base text-foreground hover:text-primary"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="mt-1 rounded-sm border border-primary/40 p-3 text-primary">
                  <Clock size={16} />
                </span>
                <div>
                  <p className="text-[0.58rem] uppercase tracking-[0.35em] text-muted-foreground">
                    Hours
                  </p>
                  <p className="mt-2 text-base text-foreground">{cms.hours}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={whatsappHref(cms.whatsapp, cms.whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-6 py-3.5 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-white shadow-md transition-opacity hover:opacity-90"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
                <a
                  href={telHref(cms.phone)}
                  className="inline-flex items-center gap-2 rounded-sm border border-primary/50 px-6 py-3.5 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Phone size={16} />
                  Call Now
                </a>
                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border border-primary/50 px-6 py-3.5 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Navigation size={16} />
                  Get Directions
                </a>
              </div>

              <div className="mt-8 overflow-hidden rounded-sm border border-border">
                <iframe
                  src={mapsEmbedUrl}
                  title="Excellent Event Planner location map"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full grayscale-[0.2] md:h-72"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-sm border border-border bg-card/40 p-7 md:p-10">
              <InquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* EXTRA FEATURES BAR */}
      <section className="border-t border-border bg-background py-10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="md:col-span-1 py-4 text-center md:text-left">
              <h3 className="font-display text-2xl md:text-3xl text-primary leading-tight">
                Crafting<br/>
                <span className="italic">Extraordinary</span><br/>
                Moments
              </h3>
            </div>
            
            <div className="md:col-span-4 grid grid-cols-2 lg:grid-cols-4 pt-8 md:pt-0">
              {[
                { icon: Diamond, title: "Luxury Interiors", subtitle: "Timeless beauty in every detail" },
                { icon: Users, title: "Spacious Setting", subtitle: "Perfect for all occasions" },
                { icon: ChefHat, title: "World-Class Cuisine", subtitle: "A feast for your senses" },
                { icon: Headset, title: "Dedicated Support", subtitle: "Always here for you" }
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 80} className="flex flex-col items-center text-center px-4 py-6">
                  <item.icon size={28} className="text-primary mb-4" strokeWidth={1.2} />
                  <h4 className="font-display text-[0.8rem] uppercase tracking-widest text-foreground">{item.title}</h4>
                  <p className="mt-2 text-[0.6rem] text-muted-foreground uppercase tracking-widest leading-relaxed max-w-[150px]">{item.subtitle}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXTRAORDINARY BANNER */}
      <section className="relative border-t border-border min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={cms.bannerImage} 
            alt="Excellent Event Planner Grand Hall" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>
        
        <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto py-24">
          <Reveal>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-primary/90 mb-6">{cms.bannerEyebrow}</p>
            <h2 className="font-display text-5xl md:text-7xl lg:text-[6rem] text-foreground drop-shadow-xl uppercase tracking-widest leading-none">
              {cms.bannerTitle}
            </h2>
            <div className="flex items-center justify-center gap-4 mt-8 mb-12">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-primary/50" />
              <Crown size={20} className="text-primary" />
              <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-sm bg-gradient-to-r from-[#e8c686] to-[#b38b4d] px-10 py-5 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#1a1a1a] shadow-[0_0_20px_rgba(232,198,134,0.3)] transition-all hover:scale-105"
            >
              <CalendarDays size={16} className="mr-3" /> Book Your Event Now
            </a>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background py-16">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <img
                src={logoUrl}
                alt="Excellent Event Planner"
                loading="lazy"
                width={72}
                height={72}
                className="h-14 w-14 rounded-full object-cover ring-1 ring-primary/30"
              />
              <p className="mt-5 font-display text-2xl uppercase tracking-[0.35em] text-brand">
                {cms.heroTitle} {cms.heroTitleAccent}
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {cms.tagline}
              </p>
              <div className="hairline mt-8 w-32" />
            </div>
            <div>
              <p className="text-[0.58rem] uppercase tracking-[0.35em] text-primary">Quick Links</p>
              <div className="mt-5 flex flex-col gap-3">
                {[
                  ["#about", "About"],
                  ["#venue", "Venue"],
                  ["#menu", "Menu & Catering"],
                  ["#gallery", "Gallery"],
                  ["#contact", "Contact"],
                ].map(([href, label]) => (
                  <a
                    key={href}
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.58rem] uppercase tracking-[0.35em] text-primary">Contact</p>
              <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                {phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="block hover:text-primary"
                  >
                    {p}
                  </a>
                ))}
                <p className="pt-2 leading-relaxed">{cms.addressShort}</p>
                <a
                  href={whatsappHref(cms.whatsapp, cms.whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-primary hover:opacity-80"
                >
                  WhatsApp
                </a>
                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-4 inline-block text-primary hover:opacity-80"
                >
                  Google Maps
                </a>
              </div>
            </div>
          </div>
          <div className="hairline mx-auto mt-14 w-full" />
          <p className="mt-8 text-center text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground">
            © {new Date().getFullYear()} Excellent Event Planner · Taxila, Rawalpindi, Pakistan
          </p>
        </div>
      </footer>
    </div>
  );
}
