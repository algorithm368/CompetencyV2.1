import React from "react";
import {
  FaCheck,
  FaEdit,
  FaTrash,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";

interface UrlInputBoxProps {
  url: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  onSubmit: () => void;
  placeholder?: string;
  colorClass?: string;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean; // Add loading prop for better UX
}

const UrlInputBox: React.FC<UrlInputBoxProps> = ({
  url,
  onChange,
  onRemove,
  onSubmit,
  placeholder,
  colorClass,
  disabled = false,
  readonly = false,
  loading = false,
}) => {
  let inputClassName =
    "w-full px-3 py-2 pr-10 border rounded focus:outline-none transition-all duration-300 ";
  if (readonly) {
    inputClassName +=
      "bg-green-50 border-green-300 text-green-800 cursor-not-allowed";
  } else if (disabled || loading) {
    inputClassName +=
      "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed";
  } else {
    inputClassName +=
      "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400";
  }
  inputClassName += " placeholder-gray-400";

  return (
    <div className={`flex flex-col gap-2 mt-2 ${colorClass || ""}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="url"
            className={inputClassName}
            placeholder={placeholder || "Enter URL or description"}
            value={url}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                url &&
                !readonly &&
                !disabled &&
                !loading
              ) {
                e.preventDefault();
                onSubmit();
              }
            }}
            disabled={disabled || loading}
            readOnly={readonly}
          />

          {/* Status icon inside input */}
          {readonly && (
            <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
          )}
          {loading && (
            <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin" />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Edit/Remove button */}
          {url && (
            <button
              type="button"
              className={`px-3 py-2 rounded transition flex items-center gap-2 ${
                readonly
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200"
              } ${
                disabled && !readonly ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onRemove}
              disabled={(disabled || loading) && !readonly}
              title={readonly ? "Click to edit evidence" : "Remove evidence"}
            >
              {readonly ? (
                <>
                  <FaEdit className="w-3 h-3" />
                  <span>Edit</span>
                </>
              ) : (
                <>
                  <FaTrash className="w-3 h-3" />
                  <span>Remove</span>
                </>
              )}
            </button>
          )}

          {/* Submit button */}
          {!readonly && (
            <button
              type="button"
              className={`px-3 py-2 rounded transition flex items-center gap-2 shadow-sm ${
                disabled || loading || !url
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 border border-green-600"
              }`}
              onClick={onSubmit}
              disabled={disabled || loading || !url}
            >
              {loading ? (
                <>
                  <FaSpinner className="w-3 h-3 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="w-3 h-3" />
                  <span>Submit</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Status indicators and submitted URL */}
      {readonly && url && (
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <FaCheck className="text-green-500 w-4 h-4" />
            <span className="text-green-700 font-medium text-sm">
              Evidence Submitted
            </span>
          </div>
          <a
            href={url.startsWith("http") ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm hover:text-blue-800 break-all block"
          >
            {url}
          </a>
        </div>
      )}
    </div>
  );
};

export default UrlInputBox;
