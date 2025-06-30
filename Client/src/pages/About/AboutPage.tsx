import Layout from "@Layouts/Layout";
import { AboutHeroSection } from "./AboutHeroSection";
import AboutSection from "./AboutSection";
import TeamMember from "./TeamSection";

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* ABOUT SECTION */}
        {/* <AboutHeroSection /> */}
        <AboutSection />
        <TeamMember />
      </div>
    </Layout>
  );
};

export default AboutPage;
