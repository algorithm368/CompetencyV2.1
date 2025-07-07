import { useEffect, useState } from "react";
import type { CareerResponse } from "../types/careerTypes";
import { fetchCareersBySearchTerm } from "../services/searchCareerAPI";

export type ItemType = {
  id: string;
  name: string;
  framework: string;
};

export function useCareerResults() {
  const [results, setResults] = useState<CareerResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("query") ?? "";
  });
  const [query, setQuery] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);

  const safeSearchTerm = typeof searchTerm === "string" ? searchTerm : "";

  useEffect(() => {
    if (!safeSearchTerm.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      setQuery("");
      setCurrentPage(1);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCareersBySearchTerm(safeSearchTerm);
        setResults(Array.isArray(data) ? data : []);
        setQuery(safeSearchTerm);
        setCurrentPage(1);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [safeSearchTerm]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (safeSearchTerm.trim()) {
      url.searchParams.set("query", safeSearchTerm);
    } else {
      url.searchParams.delete("query");
    }
    window.history.replaceState({}, "", url.toString());
  }, [safeSearchTerm]);

  // Simplified handleSearch to accept term directly
  const handleSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) {
      handleClearSearch();
      return;
    }
    setCurrentPage(1);
    setSearchTerm(trimmed);
    setQuery(trimmed);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setQuery("");
    setResults([]);
    setError(null);
    setCurrentPage(1);
  };

  const handleViewDetails = (itemId: string) => {
    console.log("View details for", itemId);
  };

  const allItems: ItemType[] = (results ?? []).flatMap(
    (group, groupIndex) =>
      group?.careers?.map((careerName, i) => ({
        id: `${group.source}-${groupIndex}-${i}`,
        name: careerName,
        framework: group.source,
      })) ?? []
  );

  const itemsPerPage = 9;
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const pageItems = allItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isEmptySearch = !safeSearchTerm.trim() && !loading;

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
