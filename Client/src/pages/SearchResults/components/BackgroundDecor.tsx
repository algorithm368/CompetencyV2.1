import React from "react";

const BackgroundDecor: React.FC = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-25"></div>
    <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
  </div>
);

export default BackgroundDecor;
