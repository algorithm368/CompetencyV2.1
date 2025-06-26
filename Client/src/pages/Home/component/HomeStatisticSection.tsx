import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { fadeInUp } from "./HomeAnimation";
import { frameworks } from "../data/HomeData";

interface StatItemProps {
  label: string;
  value: number;
}
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

export const HomeStatisticSection = () => {
  return (
    <section id="statistics" className="py-16 bg-slate-50">
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
  );
};
