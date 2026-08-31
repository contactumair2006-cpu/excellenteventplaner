import { createMiddleware } from "@tanstack/react-start";
import { isSupabaseConfigured } from "@/lib/supabase-env";

export const attachAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  if (!isSupabaseConfigured()) {
    return next({ headers: {} });
  }
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return next({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
});
