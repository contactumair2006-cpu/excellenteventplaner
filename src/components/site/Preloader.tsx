import { useEffect, useState } from "react";
import { logoUrl } from "@/lib/venue-content";

export function Preloader() {
  const [done, setDone] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDone(true);
      setHide(true);
      return;
    }

    const t1 = window.setTimeout(() => setDone(true), 1100);
    const t2 = window.setTimeout(() => setHide(true), 1600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (hide) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#111111] transition-opacity duration-500 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={done}
    >
      <img
        src={logoUrl}
        alt=""
        width={96}
        height={96}
        className="h-20 w-20 rounded-full object-cover ring-1 ring-primary/50"
      />
      <p className="mt-6 font-display text-2xl uppercase tracking-[0.45em] text-gold">RM</p>
      <div className="mt-8 h-px w-40 overflow-hidden bg-primary/20">
        <div className="preloader-line h-full w-full bg-gold" />
      </div>
    </div>
  );
}
