export function isSupabaseConfigured(): boolean {
  const url =
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_URL"]) ||
    (typeof process !== "undefined" ? process.env?.["SUPABASE_URL"] : "") ||
    "";
  const key =
    (typeof import.meta !== "undefined" && import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"]) ||
    (typeof process !== "undefined" ? process.env?.["SUPABASE_PUBLISHABLE_KEY"] : "") ||
    "";
  if (!url || !key) return false;
  if (url.includes("YOUR_PROJECT")) return false;
  return true;
}
