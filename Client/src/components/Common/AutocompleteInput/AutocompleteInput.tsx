import React, { useState, useEffect, useRef } from "react";
import { FiLoader } from "react-icons/fi";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  onSelect?: (value: string) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  options,
  placeholder = "",
  disabled = false,
  isLoading = false,
  className = "",
  onSelect,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    onSelect?.(val);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        className={`w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setShowDropdown(true)}
      />
      {isLoading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 animate-spin">
          <FiLoader size={18} />
        </div>
      )}
      {showDropdown && options.length > 0 && (
        <ul className="absolute z-50 w-full max-h-60 overflow-y-auto mt-1 bg-white border rounded shadow-lg">
          {options.map((opt, idx) => (
            <li
              key={idx}
              className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
