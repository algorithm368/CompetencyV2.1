import React from "react";
import { motion } from "framer-motion";
import SearchResultsHeader from "./SearchResultsHeader";
import ResultsGrid from "./ResultsGrid";
import Pagination from "./Pagination";

interface ItemType {
  id: number;
  name: string;
  framework: string;
}

interface SuccessStateProps {
  query: string;
  items: ItemType[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (id: number) => void;
}

// Optimized animation variants (defined outside component)
const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    },
  },
};

const SuccessState: React.FC<SuccessStateProps> = ({
  query,
  items,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}) => {
  return (
    <motion.div
      key="results"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <SearchResultsHeader query={query} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <ResultsGrid
          items={items}
          onViewDetails={onViewDetails}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </motion.div>
    </motion.div>
  );
};

export default SuccessState;
