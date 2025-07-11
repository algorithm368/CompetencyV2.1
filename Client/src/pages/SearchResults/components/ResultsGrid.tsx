import React from "react";
import { motion } from "framer-motion";
import ResultCard from "./ResultsCard";

interface ItemType {
  id: number;
  name: string;
  framework: string;
}

interface ResultsGridProps {
  items: ItemType[];
  onViewDetails: (id: number) => void;
}

// Optimized animation variants for grid
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const ResultsGrid: React.FC<ResultsGridProps> = ({
  items = [],
  onViewDetails,
}) => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 will-change-transform"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <ResultCard 
          key={item.id} 
          item={item} 
          onViewDetails={onViewDetails} 
        />
      ))}
    </motion.div>
  );
};

export default ResultsGrid;
