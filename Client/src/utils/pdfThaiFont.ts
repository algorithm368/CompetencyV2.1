import jsPDF from "jspdf";

export async function embedThaiFont(doc: jsPDF): Promise<void> {
  const fontUrl = "/fonts/THSarabunNew.ttf";
  console.log("Loading Thai font from:", fontUrl);
  
  try {
    const response = await fetch(fontUrl);
    if (!response.ok) {
      console.error("Failed to fetch font, status:", response.status);
      throw new Error(`Font loading failed: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    
    // Add font to VFS
    doc.addFileToVFS("THSarabunNew.ttf", b64);
    
    // Add both normal and bold variants
    doc.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
    doc.addFont("THSarabunNew.ttf", "THSarabunNew", "bold");
    
    // Set default font
    doc.setFont("THSarabunNew", "normal");
    
    console.log("Thai font loaded successfully");
  } catch (error) {
    console.error("Error loading Thai font:", error);
    console.warn("Falling back to default font");
    // Don't throw error, let it fall back to default font
  }
}
