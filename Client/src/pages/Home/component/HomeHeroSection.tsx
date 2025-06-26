import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

export const HomeHeroSection = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      console.log(`Searching for: ${searchTerm.trim()}`);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() !== "") {
      console.log(`Searching for: ${searchTerm.trim()}`);
    }
  };

  return (
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
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent pb-6"
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
  );
};
