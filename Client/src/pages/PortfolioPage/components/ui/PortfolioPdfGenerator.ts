import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { embedThaiFont } from "@Utils/pdfThaiFont";
import { PortfolioData } from "@Types/portfolio";
import { UserProfileData } from "@Services/competency/profileService";

export async function generatePortfolioPdf(
  portfolioData: PortfolioData,
  userProfile: UserProfileData
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  const pageWidth = 595.28; // A4 width in points
  const contentWidth = pageWidth - 2 * margin;
  let cursorY = margin;

  // CV Color Scheme
  const colors = {
    primary: [52, 73, 94],     // Dark blue-gray
    secondary: [52, 152, 219], // Professional blue
    accent: [46, 204, 113],    // Green
    light: [236, 240, 241],    // Light gray
    text: [44, 62, 80],        // Dark text
    muted: [127, 140, 141]     // Muted text
  };

  // Embed Thai font first
  await embedThaiFont(doc);

  // Helper function to ensure Thai font is set correctly
  const setThaiFont = (style: "normal" | "bold" = "normal", size: number = 12) => {
    doc.setFontSize(size);
    try {
      doc.setFont("THSarabunNew", style);
    } catch {
      console.warn(`Font style "${style}" not available, using normal`);
      doc.setFont("THSarabunNew", "normal");
    }
  };

  // Helper function to safely render Thai text
  const renderThaiText = (text: string, x: number, y: number, options?: { maxWidth?: number }) => {
    const normalizedText = text.normalize('NFC');
    doc.text(normalizedText, x, y, options);
  };

  // Helper function to draw section separator
  const drawSectionSeparator = (y: number) => {
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(3);
    doc.line(margin, y, pageWidth - margin, y);
    return y + 15;
  };

  // Helper function to create professional header box
  const createHeaderBox = (title: string, subtitle: string, y: number) => {
    const boxHeight = 60;
    
    // Background box
    doc.setFillColor(...colors.primary);
    doc.rect(margin, y, contentWidth, boxHeight, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    setThaiFont("bold", 22);
    renderThaiText(title, margin + 20, y + 25);
    
    // Subtitle
    setThaiFont("normal", 12);
    renderThaiText(subtitle, margin + 20, y + 45);
    
    return y + boxHeight + 20;
  };

  // Name processing
  const fullNameTH = `${userProfile.firstNameTH || ''} ${userProfile.lastNameTH || ''}`.trim();
  const fullNameEN = `${userProfile.firstNameEN || ''} ${userProfile.lastNameEN || ''}`.trim();
  const displayName = fullNameEN || fullNameTH || "Professional Portfolio";

  // Professional CV Header
  cursorY = createHeaderBox(
    displayName,
    "Digital Competency Portfolio | Professional Profile",
    cursorY
  );

  // Contact Information Section - Professional Layout
  doc.setTextColor(...colors.text);
  setThaiFont("bold", 16);
  renderThaiText("CONTACT INFORMATION", margin, cursorY);
  cursorY += 25;

  // Two-column contact layout
  const leftCol = margin;
  const rightCol = margin + (contentWidth / 2);
  let leftY = cursorY;
  let rightY = cursorY;

  setThaiFont("normal", 11);
  doc.setTextColor(...colors.text);

  // Left column - Personal Details
  if (fullNameTH && fullNameTH !== fullNameEN) {
    renderThaiText(`ชื่อ-นามสกุล (Thai): ${fullNameTH}`, leftCol, leftY);
    leftY += 16;
  }
  
  renderThaiText(`Email: ${userProfile.email}`, leftCol, leftY);
  leftY += 16;

  if (userProfile.phone) {
    renderThaiText(`Phone: ${userProfile.phone}`, leftCol, leftY);
    leftY += 16;
  }

  // Right column - Additional Contact
  if (userProfile.line) {
    renderThaiText(`Line ID: ${userProfile.line}`, rightCol, rightY);
    rightY += 16;
  }

  if (userProfile.address) {
    const addressLines = doc.splitTextToSize(`Address: ${userProfile.address}`.normalize('NFC'), (contentWidth / 2) - 20);
    doc.text(addressLines, rightCol, rightY);
    rightY += addressLines.length * 16;
  }

  cursorY = Math.max(leftY, rightY) + 25;

  // Executive Summary Section
  cursorY = drawSectionSeparator(cursorY);
  
  doc.setTextColor(...colors.text);
  setThaiFont("bold", 16);
  renderThaiText("EXECUTIVE SUMMARY", margin, cursorY);
  cursorY += 20;

  setThaiFont("normal", 11);
  const summaryText = `Digital professional with comprehensive competency profile across ${portfolioData.overallStats.totalSfiaSkills} SFIA framework skills and ${portfolioData.overallStats.totalTpqiCareers} TPQI career pathways. Demonstrated expertise with ${Math.round(portfolioData.overallStats.averageSfiaProgress)}% average proficiency in technical skills and ${Math.round((portfolioData.overallStats.averageTpqiSkillProgress + portfolioData.overallStats.averageTpqiKnowledgeProgress) / 2)}% in specialized knowledge domains. Ready for challenging roles in technology and digital transformation.`;
  
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(summaryLines, margin, cursorY);
  cursorY += summaryLines.length * 14 + 25;

  // Professional Competency Metrics - Dashboard Style
  cursorY = drawSectionSeparator(cursorY);
  
  setThaiFont("bold", 16);
  renderThaiText("COMPETENCY METRICS", margin, cursorY);
  cursorY += 25;

  const stats = portfolioData.overallStats;

  // Create metrics cards layout
  const cardWidth = (contentWidth - 20) / 3;
  const cardHeight = 60;
  const cardSpacing = 10;

  const metrics = [
    { label: "SFIA Skills", value: stats.totalSfiaSkills, progress: Math.round(stats.averageSfiaProgress), color: colors.secondary },
    { label: "TPQI Careers", value: stats.totalTpqiCareers, progress: Math.round(stats.averageTpqiSkillProgress), color: colors.accent },
    { label: "Knowledge Base", value: "Comprehensive", progress: Math.round(stats.averageTpqiKnowledgeProgress), color: colors.primary }
  ];

  metrics.forEach((metric, index) => {
    const x = margin + (index * (cardWidth + cardSpacing));
    
    // Card background
    doc.setFillColor(...colors.light);
    doc.rect(x, cursorY, cardWidth, cardHeight, 'F');
    
    // Progress bar background
    doc.setFillColor(220, 220, 220);
    doc.rect(x + 10, cursorY + cardHeight - 15, cardWidth - 20, 8, 'F');
    
    // Progress bar fill
    doc.setFillColor(...metric.color);
    const progressWidth = (cardWidth - 20) * (metric.progress / 100);
    doc.rect(x + 10, cursorY + cardHeight - 15, progressWidth, 8, 'F');
    
    // Metric value
    doc.setTextColor(...metric.color);
    setThaiFont("bold", 18);
    doc.text(typeof metric.value === 'number' ? metric.value.toString() : metric.value, x + 10, cursorY + 20);
    
    // Metric label
    doc.setTextColor(...colors.text);
    setThaiFont("normal", 10);
    doc.text(metric.label, x + 10, cursorY + 35);
    
    // Progress percentage
    setThaiFont("bold", 10);
    doc.text(`${metric.progress}%`, x + cardWidth - 30, cursorY + 20);
  });

  cursorY += cardHeight + 30;

  // Check if we need a new page
  if (cursorY > 650) {
    doc.addPage();
    cursorY = margin;
  }

  // SFIA Technical Skills - Professional Table
  if (portfolioData.sfiaSkills.length > 0) {
    cursorY = drawSectionSeparator(cursorY);
    
    setThaiFont("bold", 16);
    doc.setTextColor(...colors.text);
    renderThaiText("TECHNICAL SKILLS (SFIA FRAMEWORK)", margin, cursorY);
    cursorY += 25;

    // Group skills by category for better presentation
    const skillsByCategory: { [key: string]: typeof portfolioData.sfiaSkills } = {};
    portfolioData.sfiaSkills.forEach((skill) => {
      const category = skill.skill?.category?.name || "Other";
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill);
    });

    // Display top skills in a clean table
    const sortedSkills = [...portfolioData.sfiaSkills];
    sortedSkills.sort((a, b) => (b.skillPercent || 0) - (a.skillPercent || 0));
    const topSkills = sortedSkills.slice(0, 10); // Show top 10 skills

    const sfiaTableData: string[][] = [];
    topSkills.forEach((skill) => {
      const skillName = (skill.skill?.name || skill.skillCode || "N/A").normalize('NFC');
      const levelName = (skill.level?.name || "N/A").normalize('NFC');
      const categoryName = (skill.skill?.category?.name || "General").normalize('NFC');
      const progress = skill.skillPercent ? `${Math.round(skill.skillPercent)}%` : "0%";

      sfiaTableData.push([
        skillName,
        levelName,
        categoryName,
        progress,
      ]);
    });

    autoTable(doc, {
      startY: cursorY,
      head: [["Technical Skill".normalize('NFC'), "Proficiency Level".normalize('NFC'), "Category".normalize('NFC'), "Progress".normalize('NFC')]],
      body: sfiaTableData,
      margin: { left: margin, right: margin },
      styles: {
        font: "THSarabunNew",
        fontSize: 10,
        cellPadding: 8,
        overflow: "linebreak",
        valign: "middle",
        textColor: colors.text,
      },
      headStyles: {
        fillColor: colors.secondary,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        font: "THSarabunNew",
        fontSize: 11,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: contentWidth * 0.4, font: "THSarabunNew" },
        1: { cellWidth: contentWidth * 0.25, halign: "center", font: "THSarabunNew" },
        2: { cellWidth: contentWidth * 0.25, font: "THSarabunNew" },
        3: { cellWidth: contentWidth * 0.1, halign: "center", font: "THSarabunNew", fillColor: [241, 248, 233] },
      },
    });

    const autoTableRef1 = doc as jsPDF & { lastAutoTable?: { finalY: number } };
    cursorY = (autoTableRef1.lastAutoTable?.finalY || cursorY) + 20;

    // Add skills summary if there are more skills
    if (portfolioData.sfiaSkills.length > 10) {
      setThaiFont("normal", 9);
      doc.setTextColor(...colors.muted);
      renderThaiText(`*Showing top 10 skills. Total ${portfolioData.sfiaSkills.length} technical skills assessed.`, margin, cursorY);
      cursorY += 25;
    }
  }

  // Check if we need a new page before TPQI section
  if (cursorY > 600) {
    doc.addPage();
    cursorY = margin;
  }

  // TPQI Career Pathways - Professional Presentation
  if (portfolioData.tpqiCareers.length > 0) {
    cursorY = drawSectionSeparator(cursorY);
    
    setThaiFont("bold", 16);
    doc.setTextColor(...colors.text);
    renderThaiText("CAREER PATHWAY READINESS (TPQI)", margin, cursorY);
    cursorY += 25;

    const tpqiTableData: string[][] = [];
    portfolioData.tpqiCareers.forEach((career) => {
      const careerName = (career.career?.name || "N/A").normalize('NFC');
      const levelName = (career.level?.name || "N/A").normalize('NFC');
      const skillProgress = career.skillPercent ? `${Math.round(career.skillPercent)}%` : "0%";
      const knowledgeProgress = career.knowledgePercent ? `${Math.round(career.knowledgePercent)}%` : "0%";
      const overallProgress = career.skillPercent && career.knowledgePercent 
        ? `${Math.round((career.skillPercent + career.knowledgePercent) / 2)}%` 
        : "N/A";

      tpqiTableData.push([
        careerName,
        levelName,
        skillProgress,
        knowledgeProgress,
        overallProgress,
      ]);
    });

    autoTable(doc, {
      startY: cursorY,
      head: [["Career Path".normalize('NFC'), "Level".normalize('NFC'), "Skills".normalize('NFC'), "Knowledge".normalize('NFC'), "Overall".normalize('NFC')]],
      body: tpqiTableData,
      margin: { left: margin, right: margin },
      styles: {
        font: "THSarabunNew",
        fontSize: 10,
        cellPadding: 8,
        overflow: "linebreak",
        valign: "middle",
        textColor: colors.text,
      },
      headStyles: {
        fillColor: colors.accent,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        font: "THSarabunNew",
        fontSize: 11,
      },
      alternateRowStyles: {
        fillColor: [248, 252, 248],
      },
      columnStyles: {
        0: { cellWidth: contentWidth * 0.35, font: "THSarabunNew" },
        1: { cellWidth: contentWidth * 0.2, halign: "center", font: "THSarabunNew" },
        2: { cellWidth: contentWidth * 0.15, halign: "center", font: "THSarabunNew", fillColor: [227, 242, 253] },
        3: { cellWidth: contentWidth * 0.15, halign: "center", font: "THSarabunNew", fillColor: [232, 245, 233] },
        4: { cellWidth: contentWidth * 0.15, halign: "center", font: "THSarabunNew", fillColor: [255, 243, 224], fontStyle: "bold" },
      },
    });
  }

  // Key Achievements Section - Make it impressive for HR
  const autoTableRef2 = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  cursorY = (autoTableRef2.lastAutoTable?.finalY || cursorY) + 25;

  // Check for new page
  if (cursorY > 650) {
    doc.addPage();
    cursorY = margin;
  }

  cursorY = drawSectionSeparator(cursorY);
  
  setThaiFont("bold", 16);
  doc.setTextColor(...colors.text);
  renderThaiText("KEY ACHIEVEMENTS & QUALIFICATIONS", margin, cursorY);
  cursorY += 20;

  // Calculate achievements dynamically
  const achievements: string[] = [];
  
  if (portfolioData.overallStats.averageSfiaProgress > 70) {
    achievements.push("• High-performing professional with 70%+ average competency across technical skills");
  }
  
  if (portfolioData.overallStats.totalSfiaSkills > 5) {
    achievements.push(`• Comprehensive skill portfolio spanning ${portfolioData.overallStats.totalSfiaSkills} technical competencies`);
  }
  
  if (portfolioData.overallStats.totalTpqiCareers > 1) {
    achievements.push(`• Multi-pathway career readiness across ${portfolioData.overallStats.totalTpqiCareers} professional domains`);
  }
  
  if (portfolioData.overallStats.averageTpqiKnowledgeProgress > 60) {
    achievements.push("• Strong knowledge foundation with 60%+ proficiency in specialized domains");
  }
  
  // Add standard professional achievements
  achievements.push("• Digitally competent professional with verified skill assessments");
  achievements.push("• Ready for technology-driven roles and digital transformation initiatives");
  achievements.push("• Committed to continuous learning and professional development");

  setThaiFont("normal", 11);
  doc.setTextColor(...colors.text);
  
  achievements.forEach((achievement) => {
    const lines = doc.splitTextToSize(achievement, contentWidth - 20);
    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 14 + 5;
  });

  // Professional Footer with Branding
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer background
    doc.setFillColor(...colors.light);
    doc.rect(0, 800, pageWidth, 42, 'F');
    
    // Footer line
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(2);
    doc.line(0, 800, pageWidth, 800);
    
    // Footer content
    setThaiFont("normal", 9);
    doc.setTextColor(...colors.muted);
    
    // Left side - Generation info
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    renderThaiText(`Generated: ${currentDate} | Digital Competency Portfolio`, margin, 820);
    
    // Right side - Page number and professional touch
    const pageText = `Page ${i} of ${pageCount}`;
    const textWidth = doc.getTextWidth(pageText);
    doc.text(pageText, pageWidth - margin - textWidth, 820);
    
    // Professional tagline
    setThaiFont("normal", 8);
    doc.setTextColor(...colors.muted);
    renderThaiText("Professional Skills Assessment & Career Readiness Profile", margin, 832);
  }

  // Generate professional filename
  const fileDisplayName = fullNameEN || fullNameTH || userProfile.email.split('@')[0];
  const cleanName = fileDisplayName.replace(/[^a-zA-Z0-9\u0E00-\u0E7F]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `CV_${cleanName}_${dateStr}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}
