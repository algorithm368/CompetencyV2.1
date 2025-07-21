import React from "react";
import Layout from "@Layouts/Layout";
import { HomeHeroSection } from "./component/HomeHeroSection";
import { WhatsNewsSection } from "./component/WhatsNewsSection";
import { SharedBackground } from "../../components/Common/Background/WhiteTealBackground";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <SharedBackground>
        <HomeHeroSection />
        <WhatsNewsSection />
      </SharedBackground>
    </Layout>
  );
};

export default HomePage;
