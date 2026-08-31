import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminBtn, adminField, adminPrimary } from "@/components/admin/admin-ui";
import { addFaq, listFaqs, patchFaq, removeFaq } from "@/lib/cms-api";
import type { FaqRow } from "@/lib/local-db";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqs,
  head: () => ({ meta: [{ title: "FAQs — Admin" }] }),
});

function AdminFaqs() {
  const [rows, setRows] = useState<FaqRow[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const load = useCallback(async () => {
    setRows(await listFaqs(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add() {
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    await addFaq(question, answer);
    setQuestion("");
    setAnswer("");
    toast.success("FAQ added to the website");
    void load();
  }

  return (
    <AdminShell title="FAQ Management">
      <div className="rounded-sm border border-border bg-[#141414] p-5">
        <h2 className="font-display text-xl text-gold">Add FAQ</h2>
        <input className={`${adminField} mt-4`} placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <textarea className={`${adminField} mt-3`} rows={3} placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <button type="button" onClick={add} className={`${adminPrimary} mt-4`}>
          Add FAQ
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <FaqCard key={r.id} row={r} onChanged={load} />
        ))}
      </div>
    </AdminShell>
  );
}

function FaqCard({ row, onChanged }: { row: FaqRow; onChanged: () => Promise<void> | void }) {
  const [question, setQuestion] = useState(row.question);
  const [answer, setAnswer] = useState(row.answer);

  async function save() {
    await patchFaq(row.id, { question, answer });
    toast.success("FAQ saved");
    await onChanged();
  }

  return (
    <article className="rounded-sm border border-border bg-[#141414] p-5">
      <input className={adminField} value={question} onChange={(e) => setQuestion(e.target.value)} />
      <textarea className={`${adminField} mt-3`} rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={save} className={adminBtn}>
          Save
        </button>
        <button
          type="button"
          onClick={async () => {
            await patchFaq(row.id, { is_visible: !row.is_visible });
            await onChanged();
          }}
          className={adminBtn}
        >
          {row.is_visible ? "Hide" : "Show"}
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!confirm("Delete this FAQ?")) return;
            await removeFaq(row.id);
            toast.success("Deleted");
            await onChanged();
          }}
          className="rounded-sm border border-destructive/40 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.25em] text-destructive"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
