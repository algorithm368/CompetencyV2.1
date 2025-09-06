import jsPDF from "jspdf";

// Cache base64 once to avoid re-downloading the font on subsequent exports
let cachedBase64: string | null = null;

export async function embedThaiFont(doc: jsPDF): Promise<void> {
  const fontUrl = "/fonts/THSarabunNew.ttf";

  try {
    // If the font already appears in this document, just select it
    try {
      const list: Record<string, unknown> | undefined =
        typeof (
          doc as unknown as { getFontList?: () => Record<string, unknown> }
        ).getFontList === "function"
          ? (
              doc as unknown as { getFontList: () => Record<string, unknown> }
            ).getFontList()
          : undefined;
      if (list && Object.hasOwn(list, "THSarabunNew")) {
        doc.setFont("THSarabunNew", "normal");
        return;
      }
    } catch {
      // Non-fatal: proceed to ensure registration
    }

    // Ensure base64 is available (download only once per session)
    if (!cachedBase64) {
      const response = await fetch(fontUrl);
      if (!response.ok) {
        throw new Error(`Font loading failed: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      // Convert ArrayBuffer -> base64 (chunk-safe)
      const bytes = new Uint8Array(buffer);
      let binary = "";
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(
          ...bytes.subarray(i, Math.min(i + chunkSize, bytes.length))
        );
      }
      cachedBase64 = btoa(binary);
    }

    // Register font in this document (VFS and face mapping)
    doc.addFileToVFS("THSarabunNew.ttf", cachedBase64);
    doc.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
    // Map bold to the same file (works reasonably; add a real bold TTF if available)
    doc.addFont("THSarabunNew.ttf", "THSarabunNew", "bold");

    // Default to Thai font
    doc.setFont("THSarabunNew", "normal");
  } catch (error) {
    console.error("Error loading Thai font:", error);
    // Fall back gracefully (jsPDF default font)
  }
}
