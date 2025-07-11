import React from "react";

const BackgroundDecor: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none will-change-auto">
    {/* Reduced number of elements and simplified effects for better performance */}
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-15"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
  </div>
);

export default BackgroundDecor;
