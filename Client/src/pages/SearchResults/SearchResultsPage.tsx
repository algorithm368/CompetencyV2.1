import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@Layouts/Layout";
import SearchBanner from "./components/SearchBanner";
import SearchBox from "./components/SearchBox";
import { useCareerResults } from "./hooks/useCareerResults";
import { AnimatePresence } from "framer-motion";

import BackgroundDecor from "./components/BackgroundDecor";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import NoQueryState from "./components/NoQueryState";
import EmptyState from "./components/EmptyState";
import SuccessState from "./components/SuccessState";

const DEBOUNCE_DELAY = 500;

const ResultsPage: React.FC = () => {
  const {
    query,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageItems,
    totalPages,
    loading,
    error,
    handleSearch,
  } = useCareerResults();

  const navigate = useNavigate();

  const handleViewDetails = (itemId: string) => {
    navigate(`/occupation/${itemId}`);
  };

  const handleRetry = () => {
    handleSearch(searchTerm.trim() || query);
  };

  return (
    <Layout>
      <BackgroundDecor />
      <SearchBanner title="ผลลัพธ์การค้นหา" />
      <div className="relative pt-8 pb-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-teal-25 via-white to-teal-25/50 min-h-screen">
        <SearchBox
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={(term) => handleSearch(term || searchTerm)}
          placeholder="พิมพ์คำค้นหา เช่น Software Engineer หรือ Security"
        />

        <AnimatePresence mode="wait">
          {loading && <LoadingState />}
          {error && !loading && (
            <ErrorState error={error} onRetry={handleRetry} />
          )}
          {!loading && !error && !query && <NoQueryState />}
          {!loading && !error && query && pageItems.length === 0 && (
            <EmptyState query={query} />
          )}
          {!loading && !error && query && pageItems.length > 0 && (
            <SuccessState
              query={query}
              items={pageItems}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onViewDetails={handleViewDetails}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default ResultsPage;
