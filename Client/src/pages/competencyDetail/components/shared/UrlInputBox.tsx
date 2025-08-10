import React from "react";
import { FaCheck, FaTrash, FaPaperPlane, FaSpinner } from "react-icons/fa";

interface UrlInputBoxProps {
  url: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  onSubmit: () => void;
  onDelete?: () => void; // Add onDelete prop for API call
  placeholder?: string;
  colorClass?: string;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean; // Add loading prop for better UX
  deleting?: boolean; // Add deleting state for delete operation
}

const UrlInputBox: React.FC<UrlInputBoxProps> = ({
  url,
  onChange,
  onRemove,
  onSubmit,
  onDelete,
  placeholder,
  colorClass,
  disabled = false,
  readonly = false,
  loading = false,
  deleting = false,
}) => {
  let inputClassName =
    "w-full px-3 py-2 pr-10 border rounded focus:outline-none transition-all duration-300 ";
  if (readonly) {
    inputClassName +=
      "bg-green-50 border-green-300 text-green-800 cursor-not-allowed";
  } else if (disabled || loading || deleting) {
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
            disabled={disabled || loading || deleting}
            readOnly={readonly}
          />

          {/* Status icon inside input */}
          {readonly && (
            <FaCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
          )}
          {loading && (
            <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin" />
          )}
          {deleting && (
            <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4 animate-spin" />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Remove/Delete button */}
          {url && (
            <button
              type="button"
              className={`px-3 py-2 rounded transition flex items-center gap-2 ${
                readonly
                  ? deleting
                    ? "bg-red-200 text-red-800 cursor-not-allowed border border-red-300"
                    : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200"
              } ${
                disabled && !readonly ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={(e) => {
                console.log("Delete button clicked!", { readonly, onDelete, onRemove });
                e.preventDefault();
                if (readonly && onDelete) {
                  console.log("Calling onDelete function...");
                  onDelete();
                } else if (!readonly && onRemove) {
                  console.log("Calling onRemove function...");
                  onRemove();
                }
              }}
              disabled={(disabled || loading || deleting) && !readonly}
              title={
                readonly ? "Delete evidence permanently" : "Remove evidence"
              }
            >
              {readonly ? (
                deleting ? (
                  <>
                    <FaSpinner className="w-3 h-3 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FaTrash className="w-3 h-3" />
                    <span>Delete</span>
                  </>
                )
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
                disabled || loading || deleting || !url
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 border border-green-600"
              }`}
              onClick={onSubmit}
              disabled={disabled || loading || deleting || !url}
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
