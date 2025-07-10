import React from "react";

interface UrlInputBoxProps {
  url: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  onSubmit: () => void;
  placeholder?: string;
  colorClass?: string;
}

const UrlInputBox: React.FC<UrlInputBoxProps> = ({ url, onChange, onRemove, onSubmit, placeholder, colorClass }) => (
  <div className={`flex flex-col gap-2 mt-2 ${colorClass || ''}`}>
    <div className="flex gap-2">
      <input
        type="url"
        className="flex-1 px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400 transition-all duration-300"
        placeholder={placeholder || 'Enter URL'}
        value={url}
        onChange={e => onChange(e.target.value)}
      />
      {url && (
        <button
          type="button"
          className="px-3 py-2 bg-gray-100 text-gray-500 rounded hover:bg-gray-200 transition"
          onClick={onRemove}
        >
          Remove
        </button>
      )}
      <button
        type="button"
        className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition shadow-md"
        onClick={onSubmit}
        disabled={!url}
      >
        Submit
      </button>
    </div>
  </div>
);

export default UrlInputBox;
