import Layout from "@Layouts/Layout";
import { AboutHeroSection } from "./AboutHeroSection";

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* ABOUT SECTION */}
        <AboutHeroSection />
      </div>
    </Layout>
  );
};

export default AboutPage;
