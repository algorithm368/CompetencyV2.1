import React from "react";
import ResultCard from "./ResultsCard";

interface ItemType {
  id: number;
  name: string;
  framework: string;
}

interface ResultsGridProps {
  items: ItemType[];
  query: string;
  onViewDetails: (id: number) => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({
  items = [],
  query,
  onViewDetails,
}) => {
  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500">
        ไม่พบผลลัพธ์ที่ตรงกับคำค้นหา "{query}"
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ResultCard key={item.id} item={item} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
};

export default ResultsGrid;