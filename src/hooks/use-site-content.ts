import { useEffect, useState } from "react";
import { CMS_EVENT, defaultCmsContent, type CmsContent } from "@/lib/cms-store";
import { loadWebsiteContent } from "@/lib/cms-api";
import { readDb } from "@/lib/local-db";

export function useSiteContent() {
  const [content, setContent] = useState<CmsContent>(() =>
    typeof window === "undefined" ? defaultCmsContent() : readDb().content,
  );

  useEffect(() => {
    const refresh = () => setContent(readDb().content);
    void loadWebsiteContent().then(setContent);
    window.addEventListener(CMS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CMS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return content;
}
