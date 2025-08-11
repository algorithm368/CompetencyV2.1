import React, { useState, useEffect, useCallback } from "react";
import { FaUser, FaChartBar, FaCog, FaGraduationCap } from "react-icons/fa";
import { PortfolioData } from "@Types/portfolio";
import PortfolioHeader from "./components/PortfolioHeader";
import PortfolioStats from "./components/PortfolioStats";
import SkillsSection from "./components/SkillsSection";
import CareersSection from "./components/CareersSection";
import ProgressChart from "./components/ProgressChart";
import ExportActions from "./components/ExportActions";
import Layout from "@Layouts/Layout";
import { WhiteTealBackground } from "@Components/Common/Background/WhiteTealBackground";

const PortfolioPage: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "sfia" | "tpqi">(
    "overview"
  );

  const fetchPortfolioData = useCallback(async () => {
    try {
      setLoading(true);
      // For now, using mock data - replace with actual API calls when backend is ready
      const userEmail = "user@example.com"; // Get from auth context

      // Simulate API calls
      // const sfiaResponse = await fetch('/api/sfia/summary');
      // const tpqiResponse = await fetch('/api/tpqi/summary');
      // const sfiaData: SfiaSummary[] = await sfiaResponse.json();
      // const tpqiData: TpqiSummary[] = await tpqiResponse.json();

      const portfolio = getMockPortfolioData();
      setPortfolioData(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      setPortfolioData(getMockPortfolioData());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const getMockPortfolioData = (): PortfolioData => {
    return {
      userEmail: "john.doe@example.com",
      sfiaSkills: [
        {
          id: 1,
          userEmail: "john.doe@example.com",
          skillCode: "PROG",
          levelId: 3,
          skillPercent: 85,
          skill: {
            code: "PROG",
            name: "Programming/software development",
            overview:
              "The application of software programming principles and techniques.",
            note: null,
            levelId: 3,
            categoryId: 1,
            category: {
              id: 1,
              name: "Development and implementation",
              subcategoryId: null,
            },
            levels: [],
            subSkills: [],
          },
          level: {
            id: 3,
            name: "Apply",
            skillCode: "PROG",
            descriptions: [],
          },
        },
        {
          id: 2,
          userEmail: "john.doe@example.com",
          skillCode: "DTAN",
          levelId: 2,
          skillPercent: 70,
          skill: {
            code: "DTAN",
            name: "Data analysis",
            overview:
              "The investigation of data to identify patterns, trends and insights.",
            note: null,
            levelId: 2,
            categoryId: 2,
            category: {
              id: 2,
              name: "Data and content",
              subcategoryId: null,
            },
            levels: [],
            subSkills: [],
          },
          level: {
            id: 2,
            name: "Assist",
            skillCode: "DTAN",
            descriptions: [],
          },
        },
      ],
      tpqiCareers: [
        {
          id: 1,
          userEmail: "john.doe@example.com",
          careerId: 1,
          levelId: 2,
          careerLevelId: 1,
          skillPercent: 78,
          knowledgePercent: 82,
          career: {
            id: 1,
            name: "Software Developer",
          },
          careerLevel: {
            id: 1,
            careerId: 1,
            levelId: 2,
          },
          level: {
            id: 2,
            name: "Intermediate",
          },
        },
      ],
      overallStats: {
        totalSfiaSkills: 2,
        totalTpqiCareers: 1,
        averageSfiaProgress: 77.5,
        averageTpqiSkillProgress: 78,
        averageTpqiKnowledgeProgress: 82,
      },
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUser className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Portfolio Data
          </h2>
          <p className="text-gray-500">
            Unable to load your portfolio information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <WhiteTealBackground>
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <PortfolioHeader userEmail={portfolioData.userEmail} />
          {/* Navigation Tabs */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "overview"
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FaChartBar className="inline mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("sfia")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "sfia"
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FaCog className="inline mr-2" />
                  SFIA Skills
                </button>
                <button
                  onClick={() => setActiveTab("tpqi")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "tpqi"
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FaGraduationCap className="inline mr-2" />
                  TPQI Careers
                </button>
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <PortfolioStats stats={portfolioData.overallStats} />
                <ProgressChart portfolioData={portfolioData} />
                <ExportActions portfolioData={portfolioData} />
              </div>
            )}

            {activeTab === "sfia" && (
              <SkillsSection sfiaSkills={portfolioData.sfiaSkills} />
            )}

            {activeTab === "tpqi" && (
              <CareersSection tpqiCareers={portfolioData.tpqiCareers} />
            )}
          </div>
        </div>
      </WhiteTealBackground>
    </Layout>
  );
};

export default PortfolioPage;
