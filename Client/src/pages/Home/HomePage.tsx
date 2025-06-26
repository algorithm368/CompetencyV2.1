import React from "react";
import Layout from "@Layouts/Layout";
import { HomeHeroSection } from "./component/HomeHeroSection";
import { HomeComparisonSection } from "./component/HomeComparisonSection";
import { HomeAboutFrameworksSection } from "./component/HomeAboutFrameworksSection";
import { HomeStatisticSection } from "./component/HomeStatisticSection";
import { HomeFeaturesSection } from "./component/HomeFeatureSection";
import { HomeCompetencyComparisonSection } from "./component/HomeCompetencyComparisonSection";
import { HomeTeamSection } from "./component/HomeTeamSection";

/**
 * HomePage component serves as the main landing page of the application.
 * 
 * It composes several sections to provide an overview of the platform, including:
 * - Hero section
 * - Comparison section
 * - About frameworks section
 * - Statistics section
 * - Features section
 * - Competency comparison section
 * - Team section
 *
 * All sections are wrapped within a common `Layout` component for consistent styling and structure.
 *
 * @component
 */
const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="relative">
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
