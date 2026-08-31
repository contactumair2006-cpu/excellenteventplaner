import { adminField } from "@/components/admin/admin-ui";
import { readMediaFile } from "@/lib/read-media-file";
import { toast } from "sonner";

export function MediaInput({
  value,
  onChange,
  placeholder = "Image or video URL",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  async function onFile(file?: File) {
    if (!file) return;
    try {
      onChange(await readMediaFile(file));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <div className="grid gap-2">
      <input
        className={adminField}
        placeholder={placeholder}
        value={value.startsWith("data:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
      />
      <label className="inline-flex cursor-pointer items-center gap-2 text-[0.58rem] uppercase tracking-[0.22em] text-primary">
        <input
          type="file"
          accept="image/*,video/mp4,video/webm"
          className="hidden"
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
        {value.startsWith("data:") ? "File attached · replace file" : "Or upload from computer"}
      </label>
    </div>
  );
}
