import { useEffect, useState } from "react";
import type { CareerResponse } from "../types/careerTypes";
import { fetchCareersBySearchTerm } from "../services/searchCareerAPI";

// Represents the normalized item structure used in the frontend display
export type ItemType = {
  id: string;
  name: string;
  framework: string;
};

export function useCareerResults() {
  // State to store API results
  const [results, setResults] = useState<CareerResponse[]>([]);
  // Loading state indicator
  const [loading, setLoading] = useState(false);
  // Error message (if any)
  const [error, setError] = useState<string | null>(null);
  // Current search term from the URL query params
  const [searchTerm, setSearchTerm] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("query") ?? "";
  });
  // Stores the last submitted query
  const [query, setQuery] = useState("");
  // Tracks the current pagination page
  const [currentPage, setCurrentPage] = useState(1);

  // Effect: fetch data from API when the search term changes
  useEffect(() => {
    // If search term is empty, reset to empty state
    if (!searchTerm.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      setQuery("");
      setCurrentPage(1);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCareersBySearchTerm(searchTerm);
        setResults(data);
        setQuery(searchTerm);
        setCurrentPage(1); // Reset to first page for new search
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
        setResults([]); // Clear results on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  // Handles manual triggering of a search
  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(""); // clear
    setTimeout(() => setSearchTerm(query), 0); // then reset
  };

  // New function to handle clearing search
  const handleClearSearch = () => {
    setSearchTerm("");
    setQuery("");
    setResults([]);
    setError(null);
    setCurrentPage(1);
    // Update URL to remove query parameter
    const url = new URL(window.location.href);
    url.searchParams.delete("query");
    window.history.replaceState({}, "", url.toString());
  };

  // Handles logic for clicking on a career item
  const handleViewDetails = (itemId: string) => {
    console.log("View item:", itemId); // Placeholder for future implementation
  };

  // Transforms raw API results into a flat list of ItemType
  const allItems: ItemType[] = results.flatMap((group, groupIndex) =>
    group.careers.map((careerName, i) => ({
      id: `${group.source}-${groupIndex}-${i}`,
      name: careerName,
      framework: group.source,
    }))
  );

  // Pagination logic
  const itemsPerPage = 9;
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const pageItems = allItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Check if we're in empty search state
  const isEmptySearch = !searchTerm.trim() && !loading;

  // Expose state and handlers for use in components
  return {
    query,
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    currentPage,
    setCurrentPage,
    pageItems,
    totalPages,
    isEmptySearch,
    handleSearch,
    handleClearSearch,
    handleViewDetails,
  };
}