// Ambient module augmentation for jsPDF to include jspdf-autotable's lastAutoTable
// This allows using `doc.lastAutoTable?.finalY` without assertions.
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}
