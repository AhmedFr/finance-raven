export type ShareResult = "shared" | "copied" | "failed";

const SHARE_TEXT = "Ta caisse de micro-entrepreneur : ce qu'il faut garder pour l'URSSAF et les impôts.";

export async function shareApp(url: string, nav: Navigator = navigator): Promise<ShareResult> {
  if (typeof nav.share === "function") {
    try {
      await nav.share({ title: "finance-raven", text: SHARE_TEXT, url });
      return "shared";
    } catch (e) {
      if ((e as { name?: string }).name === "AbortError") return "shared";
    }
  }
  try {
    await nav.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}
