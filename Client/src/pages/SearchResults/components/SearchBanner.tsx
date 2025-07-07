import React from "react";
import { motion } from "framer-motion";

interface SearchBannerProps {
  title: string;
}

const SearchBanner: React.FC<SearchBannerProps> = ({ title }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section
      className="
        relative 
        h-40 md:h-56 lg:h-64
        bg-gradient-to-b from-teal-50 via-teal-100 to-teal-200
        overflow-hidden 
        mt-20
      "
    >
      {/* Decorative background elements matching HomePage style */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        <div className="absolute top-10 right-1/4 w-24 h-24 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-25"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-600 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-teal-700 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-teal-800 rounded-full"></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-teal-700 rounded-full"></div>
        <div className="absolute bottom-1/2 right-1/6 w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
      </div>

      {/* Flowing geometric shapes */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/5 w-8 h-8 bg-teal-400/20 rounded-full"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/5 w-6 h-6 bg-teal-500/20 rounded-full"
          animate={{
            y: [0, 10, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-4 h-4 bg-teal-600/20 rotate-45"
          animate={{
            rotate: [45, 90, 45],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-5 h-5 bg-teal-400/20 rounded-full"
          animate={{
            x: [0, 15, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="
            text-2xl md:text-4xl lg:text-5xl 
            font-bold 
            bg-gradient-to-r from-teal-700 to-teal-900 
            bg-clip-text text-transparent 
            text-center
            drop-shadow-sm
          "
        >
          {title}
        </motion.h1>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default SearchBanner;
