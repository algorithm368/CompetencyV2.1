import React, { useCallback } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBoxProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = React.memo(
  ({
    searchTerm,
    onSearchTermChange,
    onSearch,
    placeholder = "พิมพ์คำค้นหา...",
  }) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          onSearch(searchTerm);
        }
      },
      [onSearch, searchTerm]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchTermChange(e.target.value);
      },
      [onSearchTermChange]
    );

    return (
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-xl">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full pl-12 pr-10 py-3 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={() => onSearch(searchTerm)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full shadow-md transition"
            aria-label="Search"
          >
            <FaSearch size={16} />
          </button>
        </div>
      </div>
    );
  }
);

export default SearchBox;
