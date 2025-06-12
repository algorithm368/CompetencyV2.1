import React, { useRef, useEffect, useState } from "react";
import Layout from "@Layouts/Layout";
import { FaSearch } from "react-icons/fa";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface StatItemProps {
  label: string;
  value: number;
}

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
  },
  {
    title: "Interactive Cards",
    desc: "Hover animations and engaging transitions to highlight key information.",
  },
  {
    title: "Responsive Design",
    desc: "Optimized for all devices with flexible layouts and adaptive UI.",
  },
];

const StatItem: React.FC<StatItemProps> = ({ label, value }) => {
  const ref = useRef<HTMLDivElement>(null);
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { damping: 20, stiffness: 100 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    springVal.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(v).toString();
      }
    });
  }, [springVal]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={ref}
        className="text-4xl md:text-5xl font-semibold text-emerald-500"
      ></div>
      <p className="mt-1 text-gray-700">{label}</p>
    </div>
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
        {/* HERO */}
        <section
          id="home"
          className="relative mt-15 pb-32 h-screen flex flex-col items-center justify-center bg-cover bg-center bg-blend-multiply"
          style={{
            backgroundImage: "url('/src/assets/alesia-kazantceva-VWcPlbHglYc-unsplash.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <motion.div
            className="relative text-center px-6"
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-blue-400 drop-shadow-lg mb-3">Competency Database</h1>
            <p className="text-xl md:text-2xl text-gray-100 drop-shadow-md mb-6">ค้นหาและเปรียบเทียบกรอบสมรรถนะ SFIA & TPQI อย่างมีประสิทธิภาพ</p>

            <motion.div className="relative flex justify-center">
              <div className="relative w-full max-w-sm md:max-w-md transition-all duration-300 ease-in-out focus-within:max-w-lg">
                <FaSearch
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 z-10"
                  size={20}
                />

                <motion.input
                  type="text"
                  placeholder="ค้นหาอาชีพ..."
                  className="w-full pl-12 pr-10 py-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 ease-in-out"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />

                <button
                  onClick={handleSearchClick}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-sm transition"
                >
                  <FaSearch size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="py-16 bg-white"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-semibold text-center mb-8 text-black"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            เกี่ยวกับกรอบสมรรถนะ
          </motion.h2>

          <div className="max-w-4xl mx-auto space-y-6 px-4 md:px-0">
            {frameworks.map((fw, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 flex items-center justify-center bg-blue-100 rounded-full">
                    <span className="text-xl font-bold text-blue-600">{fw.name.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{fw.name}</h3>
                  <p className="text-gray-700 leading-relaxed">{fw.desc}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    <span className="font-semibold">{fw.name === "SFIA" ? "ทักษะทั้งหมด: " : "อาชีพมาตรฐาน: "}</span>
                    {fw.stats.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* STATISTICS */}
        <section
          id="statistics"
          className="py-12 bg-gray-50"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-semibold text-center mb-8 text-black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Occupation
          </motion.h2>
          <div className="max-w-3xl mx-auto grid grid-cols-2 gap-8 px-6">
            {frameworks.map((fw, idx) => (
              <StatItem
                key={idx}
                label={fw.name}
                value={fw.stats}
              />
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="py-20 bg-gray-100"
        >
          <motion.h2
            className="text-4xl font-semibold text-center mb-16 text-black"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            FEATURES
          </motion.h2>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                className="p-8 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 text-black"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <h4 className="text-xl font-bold mb-3">{f.title}</h4>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section
          id="comparison"
          className="py-20 bg-white"
        >
          <motion.h2
            className="text-4xl font-semibold text-center mb-16 text-black"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            เปรียบเทียบสมรรถนะ
          </motion.h2>
          <div className="max-w-full mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-12 px-6">
            {competencies.map((item, idx) => (
              <motion.div
                key={idx}
                className="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 text-black"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h4 className="text-xl font-bold mb-2">{item.name}</h4>
                <p className="text-gray-600 text-base mb-1">Framework: {item.framework}</p>
                <p className="text-gray-600 text-base">Performance: {item.performance}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section
          id="team"
          className="py-16 bg-white"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-semibold text-center mb-8 text-black"
            initial={{ y: 40 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            TEAM
          </motion.h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
            {[
              { name: "Natthaphat K.", role: "Full Stack Developer" },
              { name: "Somchai P.", role: "UI/UX Designer" },
              { name: "Araya S.", role: "Backend Engineer" },
            ].map((member, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center space-y-2"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <div className="h-20 w-20 flex items-center justify-center bg-emerald-200 rounded-full">
                  <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                </div>
                <h4 className="text-xl font-semibold">{member.name}</h4>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
