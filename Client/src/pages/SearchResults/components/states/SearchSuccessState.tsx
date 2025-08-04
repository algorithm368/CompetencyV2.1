import React from "react";
import { motion } from "framer-motion";
import SearchResultsWithLazyLoad from "../SearchResultsWithLazyLoad";

interface ItemType {
  id: string; // Changed from number to string
  name: string;
  framework: string;
}

interface SuccessStateProps {
  query: string;
  items: ItemType[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (id: string) => void; // Changed from number to string
}

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
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

const SuccessState: React.FC<SuccessStateProps> = ({
  query,
  items,
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
      <SearchResultsWithLazyLoad
        items={items}
        onViewDetails={onViewDetails}
        query={query}
      />
    </motion.div>
  );
};

export default SuccessState;
