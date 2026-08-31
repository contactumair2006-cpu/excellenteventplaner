import { useState } from "react";
import { toast } from "sonner";
import { useSiteContent } from "@/hooks/use-site-content";
import { usePublicMenus } from "@/hooks/use-site-collections";
import { whatsappHref } from "@/lib/cms-store";
import { submitSiteInquiry } from "@/lib/inquiry-client";

const eventTypes = [
  "Wedding",
  "Walima / Reception",
  "Mehndi",
  "Engagement",
  "Birthday",
  "Corporate Event",
  "Private Celebration",
  "Other",
];

export function InquiryForm() {
  const cms = useSiteContent();
  const menus = usePublicMenus();
  const packageOptions = ["Not sure yet", ...menus.map((m) => m.name), "Custom / Additional Selection"];
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setLoading(true);

    const guests = data.get("guest_count") as string;
    const packageName = String(data.get("selected_package") ?? "");
    const messageBase = (data.get("message") as string) || "";

    try {
      await submitSiteInquiry({
        full_name: String(data.get("full_name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: (data.get("email") as string) || null,
        event_type: String(data.get("event_type") ?? ""),
        event_date: (data.get("event_date") as string) || null,
        guest_count: guests ? Number(guests) : null,
        selected_package: packageName || null,
        message: messageBase || null,
      });
      toast.success("Thank you — our events team will contact you within 24 hours.", {
        action: {
          label: "WhatsApp Us",
          onClick: () => window.open(whatsappHref(cms.whatsapp, cms.whatsappMessage), "_blank"),
        },
      });
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "We couldn't send your request. Please call or WhatsApp us instead.",
      );
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-sm border border-border bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <input name="full_name" required placeholder="Full name" className={field} />
      <input name="phone" required placeholder="Phone / WhatsApp" className={field} />
      <input name="email" type="email" placeholder="Email address" className={field} />
      <select name="event_type" required defaultValue="" className={field}>
        <option value="" disabled>
          Event type
        </option>
        {eventTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <input name="event_date" type="date" className={field} aria-label="Preferred event date" />
      <input
        name="guest_count"
        type="number"
        min={1}
        placeholder="Estimated number of guests"
        className={field}
      />
      <select name="selected_package" defaultValue="Not sure yet" className={`${field} md:col-span-2`}>
        {packageOptions.map((p) => (
          <option key={p} value={p}>
            {p === "Not sure yet" ? "Selected package / menu" : p}
          </option>
        ))}
      </select>
      <textarea
        name="message"
        rows={4}
        placeholder="Message / special requirements…"
        className={`${field} md:col-span-2`}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-gold md:col-span-2 rounded-sm px-8 py-4 text-[0.68rem] uppercase tracking-[0.35em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Request Availability"}
      </button>
    </form>
  );
}
