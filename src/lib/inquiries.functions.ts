import { createServerFn } from "@tanstack/react-start";

export type InquiryPayload = {
  full_name: string;
  phone: string;
  email?: string | null;
  event_type: string;
  event_date?: string | null;
  guest_count?: number | null;
  message?: string | null;
  selected_package?: string | null;
};

export type InquiryRecord = InquiryPayload & {
  id: string;
  status: string;
  internal_notes?: string | null;
  created_at: string;
};

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function tableExists(admin: Awaited<ReturnType<typeof getAdmin>>) {
  const { error } = await admin.from("inquiries").select("id").limit(1);
  if (!error) return true;
  // PGRST205 = table missing in schema cache
  return false;
}

async function saveToStorage(admin: Awaited<ReturnType<typeof getAdmin>>, record: InquiryRecord) {
  const path = `${record.created_at.slice(0, 10)}/${record.id}.json`;
  const { error } = await admin.storage.from("inquiries").upload(path, JSON.stringify(record), {
    contentType: "application/json",
    upsert: true,
  });
  if (error) throw new Error(error.message);
  return record;
}

async function listFromStorage(admin: Awaited<ReturnType<typeof getAdmin>>): Promise<InquiryRecord[]> {
  const records: InquiryRecord[] = [];

  async function readJson(path: string) {
    const { data: blob, error } = await admin.storage.from("inquiries").download(path);
    if (error || !blob) return;
    try {
      records.push(JSON.parse(await blob.text()) as InquiryRecord);
    } catch {
      /* skip */
    }
  }

  const { data: top, error } = await admin.storage.from("inquiries").list("", {
    limit: 200,
    sortBy: { column: "name", order: "desc" },
  });
  if (error) throw new Error(error.message);

  for (const entry of top ?? []) {
    if (entry.name.endsWith(".json")) {
      await readJson(entry.name);
      continue;
    }
    // Treat as folder (date prefix)
    const { data: files } = await admin.storage.from("inquiries").list(entry.name, {
      limit: 200,
      sortBy: { column: "created_at", order: "desc" },
    });
    for (const file of files ?? []) {
      if (!file.name.endsWith(".json")) continue;
      await readJson(`${entry.name}/${file.name}`);
    }
  }

  return records
    .filter((r) => r?.id && r?.full_name)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((data: InquiryPayload) => {
    if (!data?.full_name?.trim() || !data?.phone?.trim() || !data?.event_type?.trim()) {
      throw new Error("Name, phone and event type are required");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const record: InquiryRecord = {
      id,
      full_name: data.full_name.trim(),
      phone: data.phone.trim(),
      email: data.email || null,
      event_type: data.event_type,
      event_date: data.event_date || null,
      guest_count: data.guest_count ?? null,
      message: data.message || null,
      selected_package: data.selected_package || null,
      status: "new",
      internal_notes: null,
      created_at,
    };

    const hasTable = await tableExists(admin);
    if (hasTable) {
      const { error } = await admin.from("inquiries").insert({
        id: record.id,
        full_name: record.full_name,
        phone: record.phone,
        email: record.email ?? null,
        event_type: record.event_type,
        event_date: record.event_date ?? null,
        guest_count: record.guest_count ?? null,
        message: record.message ?? null,
        selected_package: record.selected_package ?? null,
        status: "new",
        created_at: record.created_at,
      });
      if (error) {
        // Fall back to storage if insert fails
        await saveToStorage(admin, record);
      }
    } else {
      await saveToStorage(admin, record);
    }

    return { ok: true as const, id };
  });

export const listInquiries = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await getAdmin();
  const hasTable = await tableExists(admin);
  if (hasTable) {
    const { data, error } = await admin
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      return { source: "table" as const, rows: data as InquiryRecord[] };
    }
  }
  const rows = await listFromStorage(admin);
  return { source: "storage" as const, rows };
});

export const updateInquiry = createServerFn({ method: "POST" })
  .validator((data: { id: string; status?: string; internal_notes?: string; pathHint?: string }) => data)
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const hasTable = await tableExists(admin);

    if (hasTable) {
      const patch: { status?: string; internal_notes?: string } = {};
      if (data.status) patch["status"] = data.status;
      if (data.internal_notes !== undefined) patch["internal_notes"] = data.internal_notes;
      const { error } = await admin.from("inquiries").update(patch as never).eq("id", data.id);
      if (!error) return { ok: true as const };
    }

    // Storage update: find file and rewrite
    const listed = await listFromStorage(admin);
    const current = listed.find((r) => r.id === data.id);
    if (!current) throw new Error("Inquiry not found");
    const next: InquiryRecord = {
      ...current,
      status: data.status ?? current.status,
      internal_notes: data.internal_notes !== undefined ? data.internal_notes : (current.internal_notes ?? null),
    };
    const path = `${next.created_at.slice(0, 10)}/${next.id}.json`;
    const { error } = await admin.storage.from("inquiries").upload(path, JSON.stringify(next), {
      contentType: "application/json",
      upsert: true,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteInquiry = createServerFn({ method: "POST" })
  .validator((data: { id: string; created_at?: string }) => data)
  .handler(async ({ data }) => {
    const admin = await getAdmin();
    const hasTable = await tableExists(admin);
    if (hasTable) {
      const { error } = await admin.from("inquiries").delete().eq("id", data.id);
      if (!error) return { ok: true as const };
    }
    if (data.created_at) {
      const path = `${data.created_at.slice(0, 10)}/${data.id}.json`;
      await admin.storage.from("inquiries").remove([path]);
    } else {
      const listed = await listFromStorage(admin);
      const found = listed.find((r) => r.id === data.id);
      if (found) {
        await admin.storage.from("inquiries").remove([`${found.created_at.slice(0, 10)}/${found.id}.json`]);
      }
    }
    return { ok: true as const };
  });
