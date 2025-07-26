import Layout from "@Layouts/Layout";
import AboutSection from "./AboutSection";
import TeamMember from "./TeamSection";
import AdvisorSection from "./AdvisorSection";
import { WhiteTealBackground } from "@Components/Common/Background/WhiteTealBackground";

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <WhiteTealBackground>
        <AboutSection />
        <TeamMember />
        <AdvisorSection />
      </WhiteTealBackground>
    </Layout>
  );
};

export default AboutPage;
