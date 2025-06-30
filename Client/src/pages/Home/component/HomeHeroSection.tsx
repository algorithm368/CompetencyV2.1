import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  RefreshCw,
  Database,
  Server,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

/**
 * Renders the hero section of the Home page, featuring a clean gradient background,
 * animated title and subtitle, and a search input for users to find and compare SFIA & TPQI competency frameworks.
 * Now includes a "What's New in Version 2" section with smooth scroll animations and seamless background transition.
 *
 * ## Features
 * - Full-screen section with teal gradient background matching the navbar theme.
 * - Animated entrance for the section, title, subtitle, and search bar using Framer Motion.
 * - Prominent title ("Competency Database") and subtitle in both English and Thai.
 * - Search input field with real-time value binding and keyboard event handling.
 * - Search button and input field both trigger a search action.
<<<<<<< Updated upstream
 * - New "What's New in Version 2" section with scroll animations and feature highlights.
 * - Seamless background transition from hero to what's new section.
=======
>>>>>>> Stashed changes
 * - Accessible and responsive design with Tailwind CSS utility classes.
 *
 * ## Usage
 * Place this component at the top of the Home page to provide users with an engaging entry point and search functionality.
 *
 * @component
 * @returns {JSX.Element} The rendered hero section for the Home page.
 */

export const HomeHeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [inView, setInView] = useState(false);

<<<<<<< Updated upstream
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("version-2-features");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

=======
>>>>>>> Stashed changes
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/results?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/results?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

<<<<<<< Updated upstream
  const scrollToNewFeatures = () => {
    document.getElementById("version-2-features")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

=======
>>>>>>> Stashed changes
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

<<<<<<< Updated upstream
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, x: -20 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      icon: RefreshCw,
      title: "การผสานกรอบสมรรถนะอย่างไร้รอยต่อ",
      description:
        "รวมโครงการ SFIA และ TPQI ไว้ในแพลตฟอร์มเดียว ช่วยให้สามารถประเมินสมรรถนะจากทั้งสองกรอบได้พร้อมกันอย่างมีประสิทธิภาพ",
    },
    {
      icon: Database,
      title: "สร้างฐานข้อมูลใหม่ทั้งหมด",
      description:
        "พัฒนาฐานข้อมูลใหม่ตั้งแต่ต้น พร้อมข้อมูลที่ครบถ้วน อัปเดต SFIA เป็นเวอร์ชัน 7 เพิ่มความแม่นยำและการจับคู่สมรรถนะที่ครอบคลุม",
    },
    {
      icon: Server,
      title: "สถาปัตยกรรมเซิร์ฟเวอร์แบบโมดูลาร์",
      description:
        "ปรับปรุงจากโค้ดไฟล์เดียวขนาดกว่า 1,000 บรรทัด สู่โครงสร้างแบบ Router ที่เป็นระเบียบ ดูแลรักษาง่าย และรองรับการขยายตัวในอนาคต",
    },
  ];

  return (
    <>
      <section
        id="home-hero"
        className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 via-white to-teal-25 pt-20 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
          {/* Additional flowing background elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-teal-25 to-transparent"></div>
          <div className="absolute bottom-10 left-1/4 w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
          <div className="absolute bottom-0 right-1/3 w-32 h-32 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl opacity-25"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent pb-6"
          >
            Competency Database
          </motion.h1>
=======
  return (
    <section
      id="home-hero"
      className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 pt-20 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.h1
          variants={fadeInUp} // ใช้ Variants
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent pb-6"
        >
          Competency Database
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed font-medium"
        >
          ค้นหาและเปรียบเทียบกรอบสมรรถนะ SFIA & TPQI อย่างมีประสิทธิภาพ
        </motion.p>
>>>>>>> Stashed changes

          <motion.p
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed font-medium"
          >
            ค้นหาและเปรียบเทียบกรอบสมรรถนะ SFIA & TPQI อย่างมีประสิทธิภาพ
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.4 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <svg
                aria-hidden="true"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 z-10 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd" 
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                type="text"
                placeholder="ค้นหาอาชีพ..."
                className="w-full pl-12 pr-28 py-4 bg-white/90 backdrop-blur-sm text-gray-900 rounded-2xl border-2 border-teal-200 shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 hover:border-teal-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              <button
                onClick={handleSearchClick}
                aria-label="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-5 py-2 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 hover:scale-105 active:scale-95"
              >
                ค้นหา
              </button>
            </div>
          </motion.div>

          {/* Additional call-to-action */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.8 }}
            className="mt-12"
          >
            <p className="text-gray-600 text-sm md:text-base mb-6">
              เริ่มต้นการค้นหาอาชีพที่เหมาะสมกับคุณ
              หรือเรียนรู้เพิ่มเติมเกี่ยวกับเฟรมเวิร์ก
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-6 py-3 bg-white text-teal-600 font-medium rounded-xl border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                เรียนรู้เพิ่มเติม
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                เปรียบเทียบเฟรมเวิร์ก
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
<<<<<<< Updated upstream
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={scrollToNewFeatures}
            className="flex flex-col items-center text-teal-600 hover:text-teal-700 transition-colors group"
            aria-label="Scroll to see what's new"
          >
            <span className="text-sm font-medium mb-2">
              What's New in Version 2
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </motion.div>
          </button>
        </motion.div>
      </section>

      {/* What's New in Version 2 Section */}
      <section
        id="version-2-features"
        className="relative py-20 bg-gradient-to-b from-teal-25 via-teal-50 to-white overflow-hidden"
      >
        {/* Flowing background elements for seamless transition */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
          <div className="absolute top-20 right-20 w-40 h-40 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
        </div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-teal-500 rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-teal-600 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-teal-100/80 backdrop-blur-sm text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-teal-200/50">
              <CheckCircle className="w-4 h-4" />
              เวอร์ชัน 2.0 เปิดตัวแล้ว
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-700 to-teal-900 bg-clip-text text-transparent mb-4 pt-7">
              มีอะไรใหม่ในเวอร์ชัน 2
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              การปรับปรุงครั้งใหญ่และฟีเจอร์ใหม่ที่ทำให้การประเมินสมรรถนะมีประสิทธิภาพ
              <br />
              และครอบคลุมมากกว่าที่เคย
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-teal-100/50 group-hover:border-teal-200 h-full hover:bg-white">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-teal-700 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Animated arrow pointing to next feature */}
                  {index < features.length - 1 && (
                    <motion.div
                      className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block"
                      initial={{ opacity: 0, x: -10 }}
                      animate={
                        inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                      }
                      transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                    >
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5,
                        }}
                      >
                        <ArrowRight className="w-6 h-6 text-teal-400" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-teal-50/80 to-teal-100/80 backdrop-blur-sm rounded-2xl p-8 border border-teal-200/50 shadow-lg">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-800 to-teal-900 bg-clip-text text-transparent mb-4">
                พร้อมจะสัมผัสประสบการณ์ใหม่แล้วหรือยัง?
              </h3>
              <p className="text-teal-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                เวอร์ชัน 2 คือการยกระดับแพลตฟอร์มประเมินสมรรถนะอย่างสมบูรณ์แบบ{" "}
                <br />
                ด้วยการรวมกรอบสมรรถนะที่หลากหลาย ฐานข้อมูลที่ครอบคลุม
                และสถาปัตยกรรมที่ทันสมัย <br />
                คุณจึงมีเครื่องมือที่ทรงพลังที่สุดสำหรับการประเมินสมรรถนะอยู่ในมือ
              </p>
              <motion.button
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("home-hero")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start Exploring Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
=======
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: "easeInOut", delay: 0.4 }}
          className="relative flex justify-center"
        >
          <div className="relative w-full max-w-md">
            <svg
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 z-10 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>

            <input
              type="text"
              placeholder="ค้นหาอาชีพ..."
              className="w-full pl-12 pr-28 py-4 bg-white/90 backdrop-blur-sm text-gray-900 rounded-2xl border-2 border-teal-200 shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all duration-300 hover:border-teal-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={handleSearchClick}
              aria-label="Search" // 3. ปรับปรุง: เพิ่ม Accessibility
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-5 py-2 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 hover:scale-105 active:scale-95"
            >
              ค้นหา
            </button>
          </div>
        </motion.div>

        {/* Additional call-to-action */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: "easeInOut", delay: 0.8 }}
          className="mt-12"
        >
          <p className="text-gray-600 text-sm md:text-base mb-6">
            เริ่มต้นการค้นหาอาชีพที่เหมาะสมกับคุณ
            หรือเรียนรู้เพิ่มเติมเกี่ยวกับเฟรมเวิร์ก
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-6 py-3 bg-white text-teal-600 font-medium rounded-xl border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              เรียนรู้เพิ่มเติม
            </motion.button>
            <motion.button
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              เปรียบเทียบเฟรมเวิร์ก
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
>>>>>>> Stashed changes
  );
};
