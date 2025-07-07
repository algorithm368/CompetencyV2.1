import React from "react";

interface SearchResultsHeaderProps {
  query: string;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({ query }) => {
  return (
    <div className="mb-6 text-center">
      <span className="text-gray-600">
        แสดงผลลัพธ์สำหรับคำว่า&nbsp;
        <span className="font-medium text-blue-600">{query}</span>
      </span>
    </div>
  );
};

export default SearchResultsHeader;
