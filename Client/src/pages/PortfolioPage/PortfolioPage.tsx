import React, { useState, useEffect } from "react";
import { useAuth } from "@Contexts/AuthContext";

// Import portfolio-specific hook
import { usePortfolio } from "./hooks";

// Import components from organized structure
import LoadingState from "./components/states/LoadingState";
import ErrorState from "./components/states/ErrorState";
import NoDataState from "./components/states/NoDataState";
import PortfolioLayout from "./components/layout/PortfolioLayout";
import PortfolioHeaderWithRefresh from "./components/layout/PortfolioHeaderWithRefresh";
import RecommendationsPanel from "./components/ui/RecommendationsPanel";
import NavigationTabs, { TabType } from "./components/sections/NavigationTabs";
import PortfolioContent from "./components/sections/PortfolioContent";
import LastUpdatedFooter from "./components/ui/LastUpdatedFooter";

const PortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const { user, accessToken } = useAuth();

  // Use the portfolio hook with real API integration
  const {
    portfolioData,
    loading,
    error,
    hasData,
    fetchPortfolioData,
    refreshPortfolio,
    recommendations,
    clearError,
    lastFetched,
    isDataStale,
  } = usePortfolio(
    process.env.REACT_APP_API_BASE_URL || "http://localhost:3000",
    accessToken
  );

  // Fetch portfolio data when user is available
  useEffect(() => {
    if (user?.email && accessToken) {
      fetchPortfolioData(user.email);
    }
  }, [user?.email, accessToken, fetchPortfolioData]);

  // Handle refresh
  const handleRefresh = () => {
    if (user?.email) {
      refreshPortfolio(user.email);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState lastFetched={lastFetched} />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={handleRefresh}
        onDismiss={clearError}
      />
    );
  }

  // No data state
  if (!hasData) {
    return (
      <NoDataState
        recommendations={recommendations}
        onRefresh={handleRefresh}
      />
    );
  }

  // Main portfolio view
  return (
    <PortfolioLayout>
      <PortfolioHeaderWithRefresh
        userEmail={portfolioData?.userEmail || user?.email || ""}
        isDataStale={isDataStale}
        loading={loading}
        onRefresh={handleRefresh}
        lastUpdated={lastFetched}
      />

      <RecommendationsPanel recommendations={recommendations} />

      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sfiaSkillsCount={portfolioData?.sfiaSkills.length || 0}
        tpqiCareersCount={portfolioData?.tpqiCareers.length || 0}
      />

      {portfolioData && (
        <PortfolioContent activeTab={activeTab} portfolioData={portfolioData} />
      )}

      <LastUpdatedFooter lastFetched={lastFetched} />
    </PortfolioLayout>
  );
};

export default PortfolioPage;
