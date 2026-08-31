import { isSupabaseConfigured } from "@/lib/supabase-env";
import {
  deleteInquiry,
  listInquiries,
  submitInquiry,
  updateInquiry,
  type InquiryPayload,
  type InquiryRecord,
} from "@/lib/inquiries.functions";
import {
  listLocalInquiries,
  patchLocalInquiry,
  removeLocalInquiry,
  saveLocalInquiry,
} from "@/lib/cms-api";

export async function submitSiteInquiry(data: InquiryPayload) {
  if (!isSupabaseConfigured()) {
    return { ok: true as const, id: saveLocalInquiry(data).id, source: "local" as const };
  }
  try {
    const res = await submitInquiry({ data });
    return { ...res, source: "remote" as const };
  } catch {
    return { ok: true as const, id: saveLocalInquiry(data).id, source: "local" as const };
  }
}

export async function loadSiteInquiries(): Promise<{ source: string; rows: InquiryRecord[] }> {
  const localRows = listLocalInquiries();
  if (!isSupabaseConfigured()) return { source: "local", rows: localRows };
  try {
    const res = await listInquiries();
    const remote = res.rows ?? [];
    const merged = [...remote];
    for (const row of localRows) {
      if (!merged.some((r) => r.id === row.id)) merged.push(row);
    }
    merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return { source: res.source, rows: merged };
  } catch {
    return { source: "local", rows: localRows };
  }
}

export async function updateSiteInquiry(id: string, patch: { status?: string; internal_notes?: string; created_at?: string }) {
  patchLocalInquiry(id, patch);
  if (!isSupabaseConfigured()) return;
  try {
    const data: { id: string; status?: string; internal_notes?: string } = { id };
    if (patch.status !== undefined) data.status = patch.status;
    if (patch.internal_notes !== undefined) data.internal_notes = patch.internal_notes;
    await updateInquiry({ data });
  } catch {
    /* local already updated */
  }
}

export async function deleteSiteInquiry(id: string, created_at?: string) {
  removeLocalInquiry(id);
  if (!isSupabaseConfigured()) return;
  try {
    await deleteInquiry({ data: created_at ? { id, created_at } : { id } });
  } catch {
    /* local already updated */
  }
}
