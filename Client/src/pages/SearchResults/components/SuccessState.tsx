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

const SuccessState: React.FC<SuccessStateProps> = ({
  query,
  items,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      key="results"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div variants={itemVariants}>
        <SearchResultsHeader query={query} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <ResultsGrid
          items={items}
          query={query}
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
