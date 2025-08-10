import React from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-transform duration-300 scale-100 animate-slide-up">
        <div className="p-8">
          {/* Icon and Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-amber-600 text-2xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">กรุณาตรวจสอบข้อมูลให้ถูกต้อง</p>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-700 mb-8 text-lg leading-relaxed">{message}</p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i className="fas fa-times mr-2"></i>
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i className="fas fa-check mr-2"></i>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
