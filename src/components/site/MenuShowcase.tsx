import { useState } from "react";
import { Reveal } from "./Reveal";
import { useSiteContent } from "@/hooks/use-site-content";
import { usePublicMenus } from "@/hooks/use-site-collections";

export function MenuShowcase() {
  const [active, setActive] = useState(0);
  const cms = useSiteContent();
  const dbMenus = usePublicMenus();
  const current = dbMenus[active];

  return (
    <div className="mt-16">
      <div className="flex flex-wrap justify-center gap-3">
        {dbMenus.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-sm border px-6 py-3 text-[0.62rem] uppercase tracking-[0.28em] transition-colors ${
              active === i
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
            }`}
          >
            {m.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActive(dbMenus.length)}
          className={`rounded-sm border px-6 py-3 text-[0.62rem] uppercase tracking-[0.28em] transition-colors ${
            active === dbMenus.length
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
          }`}
        >
          Additional Selection
        </button>
      </div>

      <Reveal key={active} className="mt-10">
        {active < dbMenus.length && current ? (
          <article className="rounded-sm border border-border bg-background/80 p-8 md:p-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-primary">{current.badge}</p>
                <h3 className="mt-3 font-display text-4xl text-gold md:text-5xl">{current.name}</h3>
              </div>
              <a
                href="#contact"
                className="rounded-sm border border-primary/50 px-6 py-3 text-[0.6rem] uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Request This Package
              </a>
            </div>
            <div className="hairline mt-8 w-full" />
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {current.sections.map((sec) => (
                <div key={sec.label}>
                  <p className="text-[0.62rem] uppercase tracking-[0.35em] text-primary/90">
                    {sec.label}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {sec.items.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="mt-2 h-px w-4 shrink-0 bg-primary/60" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        ) : (
          <article className="rounded-sm border border-border bg-background/80 p-8 md:p-12">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-primary">À La Carte</p>
            <h3 className="mt-3 font-display text-4xl text-gold md:text-5xl">Additional Selection</h3>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              Elevate your celebration with specialty stalls, roasts, refreshment corners and sweet
              bars — curated as exclusive additions to any package.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {cms.additionalSelection.map((a) => (
                <span
                  key={a}
                  className="rounded-sm border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {a}
                </span>
              ))}
            </div>
            <a
              href="#contact"
              className="mt-10 inline-block rounded-sm border border-primary/50 px-6 py-3 text-[0.6rem] uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Request a Custom Menu
            </a>
          </article>
        )}
      </Reveal>
    </div>
  );
}
