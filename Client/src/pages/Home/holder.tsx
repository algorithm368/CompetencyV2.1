import React, { useRef, useEffect, useState } from "react";
import Layout from "@Layouts/Layout";
import { FaSearch } from "react-icons/fa";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Star,
  Image,
  X,
  Database,
  RefreshCw,
  Code,
  Shield,
} from "lucide-react";

interface StatItemProps {
  label: string;
  value: number;
}

// Badge Component (ใช้แทน shadcn/ui)
const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}) => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = {
    default: "bg-blue-500 text-white",
    secondary: "bg-gray-100 text-gray-700",
    outline: "border border-gray-200 text-gray-600 bg-white",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

const comparisonData = [
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
    category: "Data Management",
    version1: {
      title: "Basic Data Handling",
      description:
        "Limited data processing capabilities with basic storage solutions",
      icon: <Database className="w-6 h-6 text-red-500" />,
      status: "Basic",
    },
    version2: {
      title: "Advanced Data Processing",
      description:
        "Intelligent data management with AI-powered insights and optimized storage",
      icon: <Database className="w-6 h-6 text-green-500" />,
      status: "Intelligent",
    },
  },
];

const frameworks = [
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

const competencies = [
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

const features = [
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

const teamMembers = [
  { name: "Natthaphat K.", role: "Full Stack Developer" },
  { name: "Somchai P.", role: "UI/UX Designer" },
  { name: "Araya S.", role: "Backend Engineer" },
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
};

const StatItem: React.FC<StatItemProps> = ({ label, value }) => {
  const ref = useRef<HTMLDivElement>(null);
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    damping: 25,
    stiffness: 80,
    mass: 1.2,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionVal.set(value);
      }, 200);
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    const unsubscribe = springVal.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(v).toLocaleString();
      }
    });
    return unsubscribe;
  }, [springVal]);

  return (
    <motion.div
      className="flex flex-col items-center p-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div
        ref={ref}
        className="text-4xl md:text-5xl font-bold text-blue-600 mb-2"
      >
        0
      </div>
      <p className="text-slate-600 text-center font-medium">{label}</p>
    </motion.div>
  );
};

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/results?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/results?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <Layout>
      <div className="relative">
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
        >
          <div className="absolute inset-0 bg-[url('/src/assets/alesia-kazantceva-VWcPlbHglYc-unsplash.jpg')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/80"></div>

          <motion.div
            className="relative z-10 text-center px-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2,
            }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.4,
              }}
            >
              Competency Database
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.6,
              }}
            >
              ค้นหาและเปรียบเทียบกรอบสมรรถนะ SFIA & TPQI อย่างมีประสิทธิภาพ
            </motion.p>

            <motion.div
              className="relative flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.8,
              }}
            >
              <div className="relative w-full max-w-md">
                <FaSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 z-10"
                  size={20}
                />

                <motion.input
                  type="text"
                  placeholder="ค้นหาอาชีพ..."
                  className="w-full pl-12 pr-16 py-4 bg-white/95 backdrop-blur-sm text-slate-900 rounded-2xl border border-slate-300 shadow-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.15)",
                  }}
                />

                <motion.button
                  onClick={handleSearchClick}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSearch size={16} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* COMPARISON SECTION */}
        <section id="comparison-versions" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800"
              {...fadeInUp}
              viewport={{ once: true, margin: "-100px" }}
              whileInView="animate"
              initial="initial"
            >
              System Comparison
            </motion.h2>

            <div className="space-y-8">
              {comparisonData.map((comparison, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: index * 0.1,
                  }}
                >
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">
                      {comparison.category}
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Version 1 */}
                    <div className="p-8 border-r border-slate-200">
                      <div className="flex items-center mb-4">
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-700 mr-3"
                        >
                          Version 1.0
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-red-200 text-red-600"
                        >
                          {comparison.version1.status}
                        </Badge>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {comparison.version1.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800 mb-2">
                            {comparison.version1.title}
                          </h4>
                          <p className="text-slate-600 leading-relaxed">
                            {comparison.version1.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Version 2 */}
                    <div className="p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
                      <div className="flex items-center mb-4">
                        <Badge className="bg-blue-500 text-white mr-3">
                          Version 2.0
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-green-200 text-green-600 bg-green-50"
                        >
                          {comparison.version2.status}
                        </Badge>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {comparison.version2.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-slate-800 mb-2">
                            {comparison.version2.title}
                          </h4>
                          <p className="text-slate-600 leading-relaxed">
                            {comparison.version2.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT FRAMEWORKS SECTION */}
        <section id="about" className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800"
              {...fadeInUp}
              viewport={{ once: true, margin: "-100px" }}
              whileInView="animate"
              initial="initial"
            >
              เกี่ยวกับกรอบสมรรถนะ
            </motion.h2>

            <div className="space-y-8">
              {frameworks.map((fw, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-8 p-8 bg-white rounded-2xl shadow-lg"
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: idx * 0.2,
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                >
                  <motion.div
                    className="flex-shrink-0"
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="h-20 w-20 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {fw.name.charAt(0)}
                      </span>
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">
                      {fw.name}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-3">
                      {fw.desc}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <span className="font-semibold mr-1">
                        {fw.name === "SFIA"
                          ? "ทักษะทั้งหมด: "
                          : "อาชีพมาตรฐาน: "}
                      </span>
                      {fw.stats.toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section id="statistics" className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800"
              {...fadeInUp}
              viewport={{ once: true, margin: "-100px" }}
              whileInView="animate"
              initial="initial"
            >
              Occupation Statistics
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {frameworks.map((fw, idx) => (
                <StatItem key={idx} label={fw.name} value={fw.stats} />
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800"
              {...scaleIn}
              viewport={{ once: true, margin: "-100px" }}
              whileInView="animate"
              initial="initial"
            >
              Features
            </motion.h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="p-8 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: idx * 0.1,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-4">{feature.icon}</div>
                    <h4 className="text-xl font-bold text-slate-800">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPETENCY COMPARISON SECTION */}
        <section id="competency-comparison" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800"
              {...fadeInUp}
              viewport={{ once: true, margin: "-100px" }}
              whileInView="animate"
              initial="initial"
            >
              เปรียบเทียบสมรรถนะ
            </motion.h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {competencies.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: idx * 0.1,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }}
                >
                  <div className="mb-3">
                    <Badge
                      className={`${
                        item.framework === "SFIA"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      } text-white mb-2`}
                    >
                      {item.framework}
                    </Badge>
                  </div>
                  <h4 className="text-lg font-bold mb-3 text-slate-800">
                    {item.name}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.performance}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section id="team" className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800"
              {...fadeInUp}
              viewport={{ once: true, margin: "-100px" }}
              whileInView="animate"
              initial="initial"
            >
              Our Team
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: i * 0.2,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.05,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                >
                  <motion.div
                    className="h-24 w-24 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg mb-4"
                    whileHover={{
                      scale: 1.1,
                      rotate: 10,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <span className="text-2xl font-bold text-white">
                      {member.name.charAt(0)}
                    </span>
                  </motion.div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">
                    {member.name}
                  </h4>
                  <p className="text-slate-600 text-center">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
