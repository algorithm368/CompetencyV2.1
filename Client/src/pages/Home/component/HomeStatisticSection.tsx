import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { fadeInUp } from "./HomeAnimation";
import { frameworks } from "../data/HomeData";

interface StatItemProps {
  label: string;
  value: number;
}

/**
 * `StatItem` is a React functional component that displays an animated statistic value with a label.
 *
 * This component animates the numeric value from 0 to the specified `value` prop when it enters the viewport,
 * using Framer Motion's `useMotionValue` and `useSpring` for smooth transitions. The animation is triggered
 * only once per mount, and the value is updated in the DOM using a ref for performance.
 *
 * ## Props
 * - `label` (`string`): The descriptive label displayed below the animated value.
 * - `value` (`number`): The target number to animate to when the component comes into view.
 *
 * ## Features
 * - Animates the number from 0 to `value` with a spring effect when scrolled into view.
 * - Uses a ref to update the DOM directly for efficient number rendering.
 * - Applies a fade-in and upward motion effect to the entire component on entry.
 * - Responsive and styled for center alignment.
 * - No flash on initial load - displays 0 until animation starts.
 *
 * ## Usage
 * ```tsx
 * <StatItem label="Total Users" value={12345} />
 * ```
 *
 * @component
 * @param {StatItemProps} props - The props for the StatItem component.
 * @returns {JSX.Element} The rendered animated statistic item.
 */
const StatItem: React.FC<StatItemProps> = ({ label, value }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState("0");
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
      const formattedValue = Math.floor(v).toLocaleString();
      setDisplayValue(formattedValue);
    });
    return unsubscribe;
  }, [springVal]);

  return (
    <motion.div
      className="flex flex-col items-center p-6"
      initial={{ opacity: 1, y: 40 }}
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
        {displayValue}
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
          initial="visible"
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
