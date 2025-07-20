import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Database, Code, GraduationCap } from "lucide-react";

interface ItemType {
  id: number;
  name: string;
  framework: string;
}

interface ResultCardProps {
  item: ItemType;
  onViewDetails: (id: number) => void;
}

// Framework-specific configurations
const getFrameworkConfig = (framework: string) => {
  const lowerFramework = framework.toLowerCase();

  switch (lowerFramework) {
    case "sfia":
      return {
        icon: <Code className="w-3 h-3" />,
        label: "SFIA",
        description: "Skills Framework for Information Age",
        colors: {
          badge:
            "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200/50",
          card: "border-blue-100/50 group-hover:border-blue-200",
          background: "group-hover:bg-blue-50/30",
          decorative: "bg-blue-200",
          title: "group-hover:text-blue-700",
          indicator: "bg-blue-400",
          arrow: "text-blue-600",
          button:
            "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-400",
          bottomLine: "from-blue-400 via-blue-500 to-blue-600",
        },
      };
    case "tpqi":
      return {
        icon: <GraduationCap className="w-3 h-3" />,
        label: "TPQI",
        description: "Thailand Professional Qualification Institute",
        colors: {
          badge:
            "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200/50",
          card: "border-green-100/50 group-hover:border-green-200",
          background: "group-hover:bg-green-50/30",
          decorative: "bg-green-200",
          title: "group-hover:text-green-700",
          indicator: "bg-green-400",
          arrow: "text-green-600",
          button:
            "from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-400",
          bottomLine: "from-green-400 via-green-500 to-green-600",
        },
      };
    default:
      return {
        icon: <Database className="w-3 h-3" />,
        label: framework.toUpperCase(),
        description: "Competency Framework",
        colors: {
          badge:
            "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200/50",
          card: "border-gray-100/50 group-hover:border-gray-200",
          background: "group-hover:bg-gray-50/30",
          decorative: "bg-gray-200",
          title: "group-hover:text-gray-700",
          indicator: "bg-gray-400",
          arrow: "text-gray-600",
          button:
            "from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 focus:ring-gray-400",
          bottomLine: "from-gray-400 via-gray-500 to-gray-600",
        },
      };
  }
};

// Optimized animation variants (defined outside component)
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

const arrowVariants = {
  initial: { rotate: 0 },
  hover: {
    rotate: 45,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

const ResultCard: React.FC<ResultCardProps> = ({ item, onViewDetails }) => {
  const frameworkConfig = getFrameworkConfig(item.framework);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="relative group overflow-hidden"
    >
      {/* Framework-specific decorative background elements */}
      <div className="absolute inset-0">
        <div
          className={`absolute -top-20 -right-20 w-40 h-40 ${frameworkConfig.colors.decorative} rounded-full mix-blend-multiply filter blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
        ></div>
      </div>

      <div
        className={`relative bg-white/90 rounded-2xl duration-300 p-6 border ${frameworkConfig.colors.card} h-full flex flex-col justify-between ${frameworkConfig.colors.background}`}
      >
        {/* Enhanced header with framework badge */}
        <div>
          <div className="flex items-center justify-between mb-4">
            {/* Enhanced framework badge with icon and description */}
            <div
              className={`flex items-center gap-2 ${frameworkConfig.colors.badge} px-3 py-2 rounded-full text-xs font-medium border`}
            >
              {frameworkConfig.icon}
              <div className="flex flex-col">
                <span className="font-semibold">{frameworkConfig.label}</span>
                <span className="text-xs opacity-75">
                  {frameworkConfig.description}
                </span>
              </div>
            </div>

            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              variants={arrowVariants}
              initial="initial"
              whileHover="hover"
            >
              <ArrowRight
                className={`w-4 h-4 ${frameworkConfig.colors.arrow}`}
              />
            </motion.div>
          </div>

          <h2
            className={`text-xl font-bold text-gray-900 mb-3 ${frameworkConfig.colors.title} transition-colors duration-300 leading-tight`}
          >
            {item.name}
          </h2>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span
              className={`w-2 h-2 ${frameworkConfig.colors.indicator} rounded-full`}
            ></span>
            <span>กรอบสมรรถนะ: {frameworkConfig.label}</span>
          </div>
        </div>

        {/* Action button with framework colors */}
        <div className="mt-auto">
          <motion.button
            onClick={() => onViewDetails(item.id)}
            className={`w-full bg-gradient-to-r ${frameworkConfig.colors.button} text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="flex items-center justify-center gap-2">
              ดูรายละเอียด
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        </div>

        {/* Framework-specific decoration line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${frameworkConfig.colors.bottomLine} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        ></div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
