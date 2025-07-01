import Layout from "@Layouts/Layout";
import AboutSection from "./AboutSection";
import TeamMember from "./TeamSection";
import AdvisorSection from "./AdvisorSection";

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <AboutSection />
        <TeamMember />
        <AdvisorSection />
      </div>
    </Layout>
  );
};

export default AboutPage;
