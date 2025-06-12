import jsPDF from "jspdf";
export async function embedThaiFont(doc: jsPDF): Promise<void> {
  const fontUrl = "/fonts/THSarabunNew.ttf";
  console.log("Trying to load font from:", fontUrl);
  const response = await fetch(fontUrl);
  if (!response.ok) {
    console.error("Failed to fetch font, status:", response.status);
    return;
  }
  const buffer = await response.arrayBuffer();
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  doc.addFileToVFS("THSarabunNew.ttf", b64);
  doc.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
  doc.setFont("THSarabunNew", "normal");
}
