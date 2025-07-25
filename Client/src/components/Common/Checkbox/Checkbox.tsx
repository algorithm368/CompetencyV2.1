import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onCheckedChange, disabled = false, ...props }) => {
  return (
    <input
      type="checkbox"
      className="w-4 h-4 accent-blue-600 cursor-pointer disabled:opacity-50"
      checked={checked}
      aria-checked={checked}
      aria-disabled={disabled}
      onChange={(e) => onCheckedChange(e.target.checked)}
      disabled={disabled}
      {...props}
    />
  );
};

export default Checkbox;
