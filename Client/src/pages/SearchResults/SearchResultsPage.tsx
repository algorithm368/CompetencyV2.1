import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@Layouts/Layout";
import SearchBanner from "./components/SearchBanner";
import SearchBox from "./components/SearchBox";
import SearchResultsHeader from "./components/SearchResultsHeader";
import ResultsGrid from "./components/ResultsGrid";
import Pagination from "./components/Pagination";
import { useCareerResults } from "./hooks/useCareerResults";

/**
 * ResultsPage component
 *
 * This component is the main search results page for career-related queries.
 * It integrates the search box, displays search results with pagination,
 * and handles navigation to individual occupation details.
 *
 * The page is wrapped in a Layout component that provides consistent site styling and structure.
 */
const ResultsPage: React.FC = () => {
  // Destructure all necessary state and handlers from the custom hook managing career search logic.
  const {
    query, // The last submitted search query string
    searchTerm, // The current value in the search input box
    setSearchTerm, // Function to update the search input value
    currentPage, // The current active page number for pagination
    setCurrentPage, // Function to update the current page number
    pageItems, // The career items to be displayed on the current page
    totalPages, // Total number of pages available based on results count
    handleSearch, // Function to trigger a new search based on the current input
  } = useCareerResults();

  // React Router's navigation hook for programmatic page changes
  const navigate = useNavigate();

  /**
   * Handler to navigate to the detailed occupation page.
   * @param itemId - The unique identifier of the selected occupation item
   */
  const handleViewDetails = (itemId: string) => {
    // Navigate to the occupation detail route using the selected item's ID
    navigate(`/occupation/${itemId}`);
  };

  return (
    // Main layout wrapper providing site-wide structure and styling
    <Layout>
      {/* Banner component showing the page title */}
      <SearchBanner title="ผลลัพธ์การค้นหา" />

      {/* Content container with responsive padding */}
      <div className="pt-8 pb-16 px-4 md:px-8 lg:px-16">
        {/* Search input box with controlled value and event handlers */}
        <SearchBox
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder="พิมพ์คำค้นหา เช่น Software Engineer หรือ Security"
        />

        {/* Conditionally render search results or loading message */}
        {query ? (
          <div>
            {/* Header showing the active search query */}
            <SearchResultsHeader query={query} />

            {/* Grid layout displaying the current page of career results */}
            <ResultsGrid
              items={pageItems}
              query={query}
              onViewDetails={handleViewDetails}
            />

            {/* Pagination controls to navigate between result pages */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          // Fallback message displayed while no search query has been submitted or loading
          <p className="text-center text-gray-500">กำลังโหลดคำค้นหา...</p>
        )}
      </div>
    </Layout>
  );
};

export default ResultsPage;
