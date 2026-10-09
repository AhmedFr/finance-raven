/**
 * Saves a text file. On iOS standalone PWAs, sharing a File opens "Save to Files";
 * elsewhere a Blob download works. Resolves false when the user cancelled the share sheet.
 */
export async function saveFile(filename: string, text: string, type = "application/json"): Promise<boolean> {
  const file = new File([text], filename, { type });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return true;
    } catch (e) {
      if ((e as { name?: string }).name === "AbortError") return false;
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
