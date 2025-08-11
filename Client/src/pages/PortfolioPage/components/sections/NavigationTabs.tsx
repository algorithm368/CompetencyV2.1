import React from "react";
import { FaChartBar, FaCog, FaGraduationCap } from "react-icons/fa";

export type TabType = "overview" | "sfia" | "tpqi";

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  sfiaSkillsCount: number;
  tpqiCareersCount: number;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  sfiaSkillsCount,
  tpqiCareersCount,
}) => {
  const getTabClassName = (tab: TabType) => {
    return `font-medium text-sm transition-all duration-200 ${
      activeTab === tab
        ? "bg-teal-50 text-teal-700 border border-teal-200"
        : "text-gray-600 hover:text-gray-800 border border-transparent"
    }`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg mb-6 border border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-2">
        <nav className="flex space-x-1">
          <button
            onClick={() => onTabChange("overview")}
            className={`${getTabClassName("overview")} flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50`}
          >
            <FaChartBar className="h-4 w-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => onTabChange("sfia")}
            className={`${getTabClassName("sfia")} flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50`}
          >
            <FaCog className="h-4 w-4" />
            <span>SFIA Skills ({sfiaSkillsCount})</span>
          </button>
          <button
            onClick={() => onTabChange("tpqi")}
            className={`${getTabClassName("tpqi")} flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50`}
          >
            <FaGraduationCap className="h-4 w-4" />
            <span>TPQI Careers ({tpqiCareersCount})</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default NavigationTabs;
