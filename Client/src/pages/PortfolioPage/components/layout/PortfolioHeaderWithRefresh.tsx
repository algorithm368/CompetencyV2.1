import React from "react";
import PortfolioHeader from "./PortfolioHeader";

interface PortfolioHeaderWithRefreshProps {
  userEmail: string;
  isDataStale: boolean;
  loading: boolean;
  onRefresh: () => void;
  lastUpdated?: Date;
}

const PortfolioHeaderWithRefresh: React.FC<PortfolioHeaderWithRefreshProps> = ({
  userEmail,
  isDataStale,
  loading,
  onRefresh,
  lastUpdated,
}) => {
  return (
    <PortfolioHeader
      userEmail={userEmail}
      isDataStale={isDataStale}
      loading={loading}
      onRefresh={onRefresh}
      lastUpdated={lastUpdated}
    />
  );
};

export default PortfolioHeaderWithRefresh;
