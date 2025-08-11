import React from "react";
import Layout from "@Layouts/Layout";
import { WhiteTealBackground } from "@Components/Common/Background/WhiteTealBackground";

interface PortfolioLayoutProps {
  children: React.ReactNode;
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({ children }) => {
  return (
    <Layout>
      <WhiteTealBackground>
        <div className="pt-20 pb-16">
          {children}
        </div>
      </WhiteTealBackground>
    </Layout>
  );
};

export default PortfolioLayout;
