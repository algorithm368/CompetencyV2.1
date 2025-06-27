import React from "react";
import Layout from "@Layouts/Layout";
import { HomeHeroSection } from "./component/HomeHeroSection";
import { HomeComparisonSection } from "./component/HomeComparisonSection";
import { HomeAboutFrameworksSection } from "./component/HomeAboutFrameworksSection";
import { HomeStatisticSection } from "./component/HomeStatisticSection";
import { HomeFeaturesSection } from "./component/HomeFeatureSection";
import { HomeCompetencyComparisonSection } from "./component/HomeCompetencyComparisonSection";
import { HomeTeamSection } from "./component/HomeTeamSection";

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-black">
        {/* HERO SECTION */}
        <HomeHeroSection />

        {/* COMPARISON SECTION */}
        <HomeComparisonSection />

        {/* ABOUT FRAMEWORKS SECTION */}
        <HomeAboutFrameworksSection />

        {/* STATISTICS SECTION */}
        <HomeStatisticSection />

        {/* FEATURES SECTION */}
        <HomeFeaturesSection />

        {/* COMPETENCY COMPARISON SECTION */}
        <HomeCompetencyComparisonSection />

        {/* TEAM SECTION */}
        <HomeTeamSection />
      </div>
    </Layout>
  );
};

export default HomePage;
