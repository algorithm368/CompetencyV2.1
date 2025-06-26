import { motion } from "framer-motion";
import { Badge } from "./HomeComponents";
import { fadeInUp } from "./HomeAnimation";
import { competencies } from "../data/HomeData";

export const HomeCompetencyComparisonSection = () => {
  return (
    <section id="competency-comparison" className="py-16 bg-slate-50">
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
              className="p-6 bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
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
                    item.framework === "SFIA" ? "bg-blue-500" : "bg-green-500"
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
  );
};
