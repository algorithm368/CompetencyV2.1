import React, { useState, useEffect } from "react";
import { Navbar, Footer } from "@Components/ExportComponent";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar isTop={isTop} />

      <main className="flex-1 z-10">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
