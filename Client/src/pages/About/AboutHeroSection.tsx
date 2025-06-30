import { motion } from "framer-motion";

export const AboutHeroSection = () => (
  <section
    id="about-hero"
    className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 w-full"
  >
    <div className="absolute inset-0 bg-[url('/src/assets/alesia-kazantceva-VWcPlbHglYc-unsplash.jpg')] bg-cover bg-center opacity-20"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/80"></div>

    <motion.div
      className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2,
      }}
    >
      <motion.h1
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent pb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1, 
          ease: [0.25, 0.46, 0.45, 0.94], 
          delay: 0.4 
        }}
      >
        เกี่ยวกับพวกเรา
      </motion.h1>
      
      <motion.p
        className="text-lg md:text-2xl text-slate-200 mb-6 leading-relaxed"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1, 
          ease: [0.25, 0.46, 0.45, 0.94], 
          delay: 0.6 
        }}
      >
        ระบบประเมินและเปรียบเทียบสมรรถนะตามมาตรฐาน TPQI & SFIA
        <br />
        เพื่อการพัฒนาทักษะและอาชีพอย่างมีประสิทธิภาพ
      </motion.p>
    </motion.div>
  </section>
);
