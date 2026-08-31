const MAX_BYTES = 2_000_000;

export function readMediaFile(file: File): Promise<string> {
  if (file.size > MAX_BYTES) {
    return Promise.reject(new Error("File is too large (max 2MB). Compress it or paste a public URL."));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}
