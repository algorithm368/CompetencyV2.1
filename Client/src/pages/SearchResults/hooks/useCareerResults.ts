import { useEffect, useState } from "react";
import type { CareerResponse } from "../types/careerTypes";
import { fetchCareersBySearchTerm } from "../services/searchCareerAPI";

const DEBOUNCE_DELAY = 500;

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

  const getErrorMessage = (err: any): string => {
    if (err instanceof TypeError && err.message.includes("fetch")) {
      return "ไม่สามารถเชื่อมต่อเครือข่ายได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง";
    }
    if (err.name === "NetworkError" || err.code === "NETWORK_ERROR") {
      return "เกิดปัญหาเครือข่าย กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง";
    }
    if (
      err.message?.toLowerCase().includes("network") ||
      err.message?.toLowerCase().includes("fetch") ||
      err.message?.toLowerCase().includes("connection")
    ) {
      return "ไม่สามารถเชื่อมต่อเครือข่ายได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง";
    }
    if (err.response) {
      const status = err.response.status;
      switch (status) {
        case 400:
          return "คำค้นหาไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง";
        case 401:
          return "ไม่ได้รับอนุญาตให้เข้าถึงข้อมูล กรุณาเข้าสู่ระบบใหม่";
        case 403:
          return "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้";
        case 404:
          return "ไม่พบข้อมูลที่ต้องการ";
        case 429:
          return "ค้นหาบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง";
        case 500:
          return "เกิดข้อผิดพลาดในระบบเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้งในภายหลัง";
        case 502:
        case 503:
        case 504:
          return "เซิร์ฟเวอร์ไม่สามารถให้บริการได้ในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง";
        default:
          return `เกิดข้อผิดพลาดในการดึงข้อมูล (รหัสข้อผิดพลาด: ${status})`;
      }
    }
    if (err.name === "TimeoutError" || err.message?.includes("timeout")) {
      return "การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง";
    }
    if (err.name === "AbortError") {
      return "การค้นหาถูกยกเลิก กรุณาลองใหม่อีกครั้ง";
    }
    if (err.message) {
      return `เกิดข้อผิดพลาดในการดึงข้อมูล: ${err.message}`;
    }
    return "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง";
  };

  // ✅ Debounced fetch
  useEffect(() => {
    if (!safeSearchTerm.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      setQuery("");
      setCurrentPage(1);
      return;
    }

    setLoading(true);
    setError(null);

    const handler = setTimeout(async () => {
      try {
        const data = await fetchCareersBySearchTerm(safeSearchTerm.trim());
        setResults(Array.isArray(data) ? data : []);
        setQuery(safeSearchTerm.trim());
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching career data:", err);
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler); // ✅ Cancel debounce if user keeps typing
  }, [safeSearchTerm]);

  // Sync searchTerm with URL
  useEffect(() => {
    const url = new URL(window.location.href);
    if (safeSearchTerm.trim()) {
      url.searchParams.set("query", safeSearchTerm.trim());
    } else {
      url.searchParams.delete("query");
    }
    window.history.replaceState({}, "", url.toString());
  }, [safeSearchTerm]);

  const handleSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) {
      handleClearSearch();
      return;
    }
    setCurrentPage(1);
    setSearchTerm(trimmed); // 👈 trigger debounce
    setQuery(trimmed); // still keep this for UI display
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
