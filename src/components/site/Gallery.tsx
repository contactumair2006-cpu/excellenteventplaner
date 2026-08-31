import { useState } from "react";
import { X, Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { usePublicGallery } from "@/hooks/use-site-collections";

const filters = ["All", "Videos", "Weddings", "Venue", "Décor", "Events"];

export function Gallery() {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<{ url: string; title: string } | null>(null);
  const gallery = usePublicGallery();
  const dbGallery = gallery.map((d) => ({
    url: d.url,
    title: d.title,
    tag: d.category,
  }));

  const isVideo = (url: string) =>
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.includes("/videos/") ||
    url.includes("/video/");

  const items = dbGallery.filter((g) => {
    if (filter === "All") return true;
    if (filter === "Videos") return isVideo(g.url) || g.tag === "Videos";
    return g.tag === filter;
  });

  return (
    <>
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-sm border px-5 py-2 text-[0.62rem] uppercase tracking-[0.28em] transition-colors ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const itemIsVideo = isVideo(item.url) || item.tag === "Videos";
          return (
            <Reveal
              key={`${item.url}-${item.title}`}
              delay={i * 70}
              className={i % 5 === 0 ? "sm:col-span-2 sm:row-span-2" : ""}
            >
              <button
                type="button"
                onClick={() => setActive({ url: item.url, title: item.title })}
                className={`group relative block h-full w-full overflow-hidden rounded-sm border text-left ${
                  itemIsVideo ? "border-primary/50 bg-black" : "border-border"
                }`}
              >
                {itemIsVideo ? (
                  <>
                    <video
                      src={item.url}
                      muted
                      playsInline
                      autoPlay
                      loop
                      className={`w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06] opacity-85 ${
                        i % 5 === 0 ? "h-[320px] sm:h-[640px]" : "h-[320px]"
                      }`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/10">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary bg-background/85 text-primary shadow-[0_0_25px_rgba(200,168,107,0.5)] backdrop-blur transition-transform duration-300 group-hover:scale-110">
                        <Play size={26} className="ml-1 fill-primary" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06] ${
                      i % 5 === 0 ? "h-[320px] sm:h-[640px]" : "h-[320px]"
                    }`}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-85" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                  {itemIsVideo ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/40 px-2.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.25em] text-primary">
                      <Play size={10} className="fill-primary" /> Function Video
                    </span>
                  ) : (
                    <p className="text-[0.6rem] uppercase tracking-[0.35em] text-primary">{item.tag}</p>
                  )}
                  <p className="mt-2 font-display text-xl text-foreground drop-shadow">{item.title}</p>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-background/95 p-4 backdrop-blur-md"
          onClick={() => setActive(null)}
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-6 top-6 text-primary z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setActive(null)}
          >
            <X size={28} />
          </button>
          <div
            className="max-h-[90vh] max-w-5xl w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(active.url) ? (
              <div className="flex flex-col items-center w-full">
                <video
                  src={active.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[78vh] w-auto max-w-full rounded-sm border border-primary/40 shadow-2xl bg-black"
                />
                <p className="mt-4 text-center font-display text-lg text-primary">{active.title}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <img
                  src={active.url}
                  alt={active.title}
                  className="max-h-[78vh] w-auto max-w-full rounded-sm border border-primary/30 object-contain shadow-2xl"
                />
                <p className="mt-4 text-center font-display text-lg text-primary">{active.title}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
