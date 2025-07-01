import Layout from "@Layouts/Layout";
import AboutSection from "./AboutSection";
import TeamMember from "./TeamSection";

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <AboutSection />
        <TeamMember />
      </div>
    </Layout>
  );
};

export default AboutPage;
