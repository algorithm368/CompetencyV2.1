import { motion } from "framer-motion";
import { fadeInUp } from "./HomeAnimation";
import { teamMembers } from "../data/HomeData";

export const HomeTeamSection = () => {
  return (
    <section id="team" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800"
          {...fadeInUp}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="animate"
          initial="initial"
        >
          Our Team
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: i * 0.2,
              }}
              whileHover={{
                y: -10,
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            >
              <motion.div
                className="h-24 w-24 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg mb-4 border-4 border-white"
                whileHover={{
                  scale: 1.1,
                  rotate: 10,
                  transition: { duration: 0.3 },
                }}
              >
                <span className="text-2xl font-bold text-white">
                  {member.name.charAt(0)}
                </span>
              </motion.div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">
                {member.name}
              </h4>
              <p className="text-slate-600 text-center font-medium">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
