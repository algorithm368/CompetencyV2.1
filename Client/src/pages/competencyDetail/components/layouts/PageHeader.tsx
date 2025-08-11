import React from "react";
import { motion } from "framer-motion";
import BackButton from "../ui/BackButton";
import HeaderActions from "../ui/HeaderActions";
import FrameworkBadge from "../ui/FrameworkBadge";
import QuickNavigation from "../ui/QuickNavigation";
import CompetencyInfo from "../ui/CompetencyInfo";
import StatsCard from "../ui/StatsCard";

interface QuickNavItem {
  label: string;
  href: string;
}

interface PageHeaderProps {
  source: "sfia" | "tpqi";
  id: string;
  competencyTitle: string;
  lastFetched?: Date;
  quickNavItems: QuickNavItem[];
  competencyData: unknown;
  isBookmarked: boolean;
  isFavorited: boolean;
  onBack: () => void;
  onBookmark: () => void;
  onFavorite: () => void;
  onShare: () => void;
  onPrint: () => void;
  onDownload: () => void;
  onTooltip: (key: string | null) => void;
  getFrameworkIcon: (framework: string) => React.ReactNode;
  getFrameworkColor: (framework: string) => string;
  itemVariants: unknown;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  source,
  id,
  competencyTitle,
  lastFetched,
  quickNavItems,
  competencyData,
  isBookmarked,
  isFavorited,
  onBack,
  onBookmark,
  onFavorite,
  onShare,
  onPrint,
  onDownload,
  onTooltip,
  getFrameworkIcon,
  getFrameworkColor,
  itemVariants,
}) => {
  return (
    <motion.header variants={itemVariants} className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <BackButton onClick={onBack} />

        <HeaderActions
          isBookmarked={isBookmarked}
          isFavorited={isFavorited}
          onBookmark={onBookmark}
          onFavorite={onFavorite}
          onShare={onShare}
          onPrint={onPrint}
          onDownload={onDownload}
          onTooltip={onTooltip}
        />
      </div>

      {/* Enhanced Title Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <FrameworkBadge
              framework={source}
              getFrameworkIcon={getFrameworkIcon}
              getFrameworkColor={getFrameworkColor}
            />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
            {competencyTitle}
          </h1>

          <CompetencyInfo id={id} lastFetched={lastFetched} />

          <QuickNavigation source={source} items={quickNavItems} />
        </div>

        {/* Enhanced Stats Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 shadow-xl lg:min-w-80"
        >
          <StatsCard source={source} competencyData={competencyData} />
        </motion.div>
      </div>
    </motion.header>
  );
};

export default PageHeader;
