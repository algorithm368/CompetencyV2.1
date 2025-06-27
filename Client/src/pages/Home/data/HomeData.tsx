import {
  ArrowRight,
  Star,
  Zap,
  X,
  Database,
  RefreshCw,
  Code,
  Shield,
} from "lucide-react";

export const comparisonData = [
  {
    category: "Platform Integration",
    version1: {
      title: "SFIA and TPQI platform is not synced yet",
      description: "Separate systems requiring manual data transfer",
      icon: <X className="w-6 h-6 text-red-500" />,
      status: "Limited",
    },
    version2: {
      title: "SFIA and TPQI platform is synced",
      description: "Seamless integration with real-time synchronization",
      icon: <RefreshCw className="w-6 h-6 text-green-500" />,
      status: "Optimized",
    },
  },
  {
    category: "Server Architecture",
    version1: {
      title: "Monolithic Legacy System",
      description:
        "The old server was written as a single, messy file, which led to tightly coupled code and poor maintainability",
      icon: <Code className="w-6 h-6 text-red-500" />,
      status: "Outdated",
    },
    version2: {
      title: "Modern Modular Architecture",
      description:
        "The new server is written in a modular, maintainable way using TypeScript and Express, with clear separation of concerns",
      icon: <Shield className="w-6 h-6 text-green-500" />,
      status: "Advanced",
    },
  },
  {
    category: "Data Completeness",
    version1: {
      title: "Incomplete Data Coverage",
      description:
        "Very limited data; consists of only examples or test data, not covering all professions.",
      icon: <Database className="w-6 h-6 text-red-500" />,
      status: "Incomplete",
    },
    version2: {
      title: "Complete Data Integration",
      description:
        "Comprehensive data from both SFIA and TPQI, covering all professions and competencies with complete details.",
      icon: <Database className="w-6 h-6 text-green-500" />,
      status: "Complete",
    },
  },
];

export const frameworks = [
  {
    name: "SFIA",
    desc: `SFIA (Skills Framework for the Information Age) เป็นกรอบสมรรถนะด้านดิจิทัลระดับสากล ครอบคลุมทักษะกว่า 120 รายการ จัดเป็น 7 ระดับความรับผิดชอบ เหมาะสำหรับการวางแผนพัฒนาอาชีพและจัดการทักษะบุคลากรในองค์กรทั่วโลก`,
    stats: 120,
  },
  {
    name: "TPQI",
    desc: `TPQI (Thailand Professional Qualification Institute) เป็นกรอบคุณวุฒิวิชาชีพของไทย แบ่งเป็น 8 ระดับกำหนดความรู้ ทักษะ และคุณลักษณะสำคัญ มีอาชีพมาตรฐานแล้วกว่า 5,855 อาชีพ เน้นยกระดับคุณภาพแรงงานและสร้างความเชื่อมโยงระหว่างภาคอุตสาหกรรมกับการรับรองสมรรถนะ`,
    stats: 5855,
  },
];

export const competencies = [
  {
    name: "Level 1 - Entry",
    framework: "SFIA",
    performance: "Basic awareness of digital skills",
  },
  {
    name: "Level 2 - Assist",
    framework: "SFIA",
    performance: "Understand and apply under guidance",
  },
  {
    name: "ระดับ 1 – ปฏิบัติตาม",
    framework: "TPQI",
    performance: "ปฏิบัติงานตามมาตรฐานที่กำหนด",
  },
  {
    name: "ระดับ 5 – จัดการ",
    framework: "TPQI",
    performance: "วิเคราะห์ ปรับปรุง และจัดการกระบวนการทำงาน",
  },
];

export const features = [
  {
    title: "Smooth Navigation",
    desc: "Scroll smoothly between sections with active link highlighting.",
    icon: <ArrowRight className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Interactive Cards",
    desc: "Hover animations and engaging transitions to highlight key information.",
    icon: <Star className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Responsive Design",
    desc: "Optimized for all devices with flexible layouts and adaptive UI.",
    icon: <Zap className="w-8 h-8 text-blue-500" />,
  },
];

export const teamMembers = [
  { name: "Natthaphat J.", role: "Full Stack Developer" },
  { name: "Siriwat C.", role: "UI/UX Designer" },
  { name: "Jirapat K.", role: "Backend Engineer" },
];
