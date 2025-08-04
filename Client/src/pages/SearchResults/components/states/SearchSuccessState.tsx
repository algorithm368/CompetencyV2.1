import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SearchResultsWithLazyLoad from "../SearchResultsWithLazyLoad";

interface ItemType {
  id: string; // Changed from number to string
  name: string;
  framework: string;
}

interface SuccessStateProps {
  query: string;
  items: ItemType[];
  onViewDetails: (id: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0.9 }, // Start with high opacity to prevent blink
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15, // Very fast transition
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0.9, // Exit to high opacity, not 0
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};

const SuccessState: React.FC<SuccessStateProps> = ({
  query,
  items,
  onViewDetails,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key="results"
      variants={shouldReduceMotion ? {} : containerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? false : "visible"}
      exit={shouldReduceMotion ? false : "exit"}
      style={{ willChange: 'opacity' }}
    >
      <SearchResultsWithLazyLoad
        items={items}
        onViewDetails={onViewDetails}
        query={query}
      />
    </motion.div>
  );
};

export default SuccessState;
