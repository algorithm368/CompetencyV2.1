import { motion } from "framer-motion";
import { fadeInUp } from "./HomeAnimation";
import { frameworks } from "../data/HomeData";

/**
 * Renders the "About Frameworks" section on the Home page, displaying a list of competency frameworks
 * with animated cards. Each card presents the framework's name, description, and a statistic (either
 * total skills or standard occupations, depending on the framework). The section uses Framer Motion
 * for entrance and hover animations, and is styled with Tailwind CSS.
 *
 * @component
 * @example
 * <HomeAboutFrameworksSection />
 *
 * @remarks
 * - Expects a `frameworks` array and `fadeInUp` animation config to be available in the scope.
 * - Each framework object should have `name`, `desc`, and `stats` properties.
 */
export const HomeAboutFrameworksSection = () => {
  <section id="about" className="py-16 bg-white">
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
            className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-8 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300"
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
              <p className="text-slate-600 leading-relaxed mb-4">{fw.desc}</p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                <span className="font-semibold mr-1">
                  {fw.name === "SFIA" ? "ทักษะทั้งหมด: " : "อาชีพมาตรฐาน: "}
                </span>
                <span className="text-blue-800 font-bold">
                  {fw.stats.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>;
};
