import { Badge, Card, CardContent } from "./HomeComponents";
import { motion } from "framer-motion";
import { fadeInUp } from "./HomeAnimation";
import { Star, Image } from "lucide-react";
import { comparisonData } from "../data/HomeData";

/**
 * Renders the platform comparison section for the homepage.
 *
 * This component is designed to visually contrast two versions of a platform ("Version 1.0" vs. "Version 2.0").
 * It's structured in two main parts:
 * 1. A high-level, side-by-side card comparison that gives a quick visual summary of each version.
 * 2. A detailed, feature-by-feature breakdown that iterates over `comparisonData` to show specific differences.
 *
 * It leverages `framer-motion` for engaging scroll-triggered animations on the section title and individual feature rows.
 * @returns {JSX.Element} The rendered comparison section component.
 */
export const HomeComparisonSection = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title with entrance animation */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800"
          {...fadeInUp}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="animate"
          initial="initial"
        >
          Platform Comparison
        </motion.h2>

        {/* High-level summary cards comparing the two versions */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Version 1 Card: Represents the older, more basic version with neutral styling. */}
          <Card className="relative overflow-hidden border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                Version 1.0
              </Badge>
            </div>
            <CardContent className="p-8">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-400 rounded w-24 mx-auto"></div>
                    <div className="h-3 bg-gray-300 rounded w-16 mx-auto"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Classic Interface
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  Basic image display
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  Standard processing speed
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  Limited customization
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Version 2 Card: Represents the new, enhanced version with vibrant blue styling to highlight its superiority. */}
          <Card className="relative overflow-hidden border-2 border-blue-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
            <div className="absolute top-4 right-4">
              <Badge variant="default" className="bg-blue-500 text-white">
                Version 2.0
              </Badge>
            </div>
            <CardContent className="p-8">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-blue-500 rounded w-24 mx-auto"></div>
                    <div className="h-3 bg-blue-400 rounded w-16 mx-auto"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                Enhanced Platform
              </h3>
              <ul className="space-y-3 text-blue-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Advanced data integration
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Real-time synchronization
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Modular architecture
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Feature-by-Feature Comparison Section */}
        <div className="space-y-8">
          {/* Map through the comparison data to render each feature category. */}
          {comparisonData.map((item, idx) => (
            // Each comparison row animates into view as the user scrolls.
            // `delay: idx * 0.1` creates a staggered or "waterfall" animation effect.
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
              }}
            >
              <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                {item.category}
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Column for Version 1 features (styled with red to indicate limitations) */}
                <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-start mb-4">
                    {item.version1.icon}
                    <div className="ml-3 flex-1">
                      <h4 className="font-semibold text-red-800 mb-2">
                        {item.version1.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className="border-red-300 text-red-600 bg-red-50"
                      >
                        {item.version1.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-red-700 text-sm leading-relaxed">
                    {item.version1.description}
                  </p>
                </div>

                {/* Column for Version 2 features (styled with green to indicate improvements) */}
                <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-start mb-4">
                    {item.version2.icon}
                    <div className="ml-3 flex-1">
                      <h4 className="font-semibold text-green-800 mb-2">
                        {item.version2.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className="border-green-300 text-green-600 bg-green-50"
                      >
                        {item.version2.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-green-700 text-sm leading-relaxed">
                    {item.version2.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
