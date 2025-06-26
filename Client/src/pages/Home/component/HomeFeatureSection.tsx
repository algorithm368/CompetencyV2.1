import { motion } from "framer-motion";
import { scaleIn } from "./HomeAnimation";
import { features } from "../data/HomeData";

export const HomeFeaturesSection = () => {
  return (
    <section id="features" className="py-16 bg-white">
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
              className="p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
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
                <div className="mr-4 p-2 bg-blue-100 rounded-lg">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800">
                  {feature.title}
                </h4>
              </div>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
