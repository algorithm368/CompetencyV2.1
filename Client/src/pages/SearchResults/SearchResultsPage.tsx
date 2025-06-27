import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@Layouts/Layout";
import { FaSearch } from "react-icons/fa";

interface ItemType {
  id: number;
  name: string;
  framework: string;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 15;
  const [query, setQuery] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Mock data …
  const mockData: ItemType[] = [
    { id: 1, name: "Software Engineer", framework: "SFIA" },
    { id: 2, name: "Software Engineer", framework: "SFIA" },
    { id: 3, name: "Software Engineer", framework: "SFIA" },
    { id: 4, name: "Software Engineer", framework: "SFIA" },
    { id: 5, name: "Software Engineer", framework: "SFIA" },
    { id: 6, name: "Software Engineer", framework: "SFIA" },
    { id: 7, name: "Software Engineer", framework: "SFIA" },
    { id: 8, name: "Software Engineer", framework: "SFIA" },
    { id: 9, name: "Software Engineer", framework: "SFIA" },
    { id: 10, name: "Software Engineer", framework: "SFIA" },
    { id: 10, name: "Software Engineer", framework: "SFIA" },
    { id: 10, name: "Software Engineer", framework: "SFIA" },
    { id: 10, name: "Software Engineer", framework: "SFIA" },
    { id: 10, name: "Software Engineer", framework: "SFIA" },
    { id: 10, name: "Software Engineer", framework: "SFIA" },
    { id: 11, name: "Software Engineer", framework: "SFIA" },
    { id: 12, name: "Data Analyst", framework: "TPQI" },
    { id: 13, name: "System Administrator", framework: "SFIA" },
    { id: 14, name: "Business Analyst", framework: "SFIA" },
    { id: 15, name: "QA Tester", framework: "TPQI" },
    { id: 16, name: "DevOps Engineer", framework: "SFIA" },
    { id: 17, name: "UX Designer", framework: "TPQI" },
    { id: 18, name: "Network Engineer", framework: "SFIA" },
    { id: 19, name: "Project Manager", framework: "TPQI" },
    { id: 20, name: "Database Administrator", framework: "SFIA" },
  ];

  // ดึง query param จาก URL
  const getQueryParam = (param: string): string | null => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  useEffect(() => {
    const q = getQueryParam("query");
    if (q) {
      const trimmed = q.trim();
      setQuery(trimmed);
      setSearchTerm(trimmed);
      setCurrentPage(1);
    } else {
      navigate("/");
    }
  }, [location.search, navigate]);

  const filteredResults = mockData.filter((item) => {
    const lowerQuery = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(lowerQuery) ||
      item.framework.toLowerCase().includes(lowerQuery)
    );
  });

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageItems = filteredResults.slice(startIndex, endIndex);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed.length > 0) {
      navigate(`/results?query=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Layout>
      <section
        className="
          relative 
          h-40 md:h-56 lg:h-64
          bg-gradient-to-r from-blue-500 to-purple-700 
          overflow-hidden 
          animate-bg-shift 
          animate-banner-pulse mt-15
        "
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="
            absolute 
            top-1/5 left-1/6 
            w-20 h-20 
            bg-white 
            shape-circle 
            opacity-20 
            animate-circle-fast
          "
        ></div>
        <div
          className="
            absolute 
            bottom-1/6 left-1/4 
            w-12 h-12 
            bg-white 
            shape-circle 
            opacity-15 
            animate-circle-slow 
            delay-2
          "
        ></div>
        <div
          className="
            absolute 
            top-1/6 right-1/5 
            w-16 h-16 
            bg-white 
            shape-square 
            opacity-15 
            animate-square 
            delay-1
          "
        ></div>
        <div
          className="
            absolute 
            bottom-1/4 right-1/6 
            shape-triangle 
            opacity-10 
            animate-triangle 
            delay-3
          "
        ></div>
        <div
          className="
            absolute 
            top-2/5 right-1/4 
            w-0 h-0 
            border-l-[16px] border-l-transparent 
            border-r-[16px] border-r-transparent 
            border-b-[28px] border-b-[rgba(255,255,255,0.16)] 
            opacity-10 
            animate-triangle 
            delay-4
          "
        ></div>
        <div className="relative flex items-center justify-center h-full">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg">
            ผลลัพธ์การค้นหา
          </h1>
        </div>
      </section>
      <div className="pt-8 pb-16 px-4 md:px-8 lg:px-16">
        {/* ช่องค้นหา (Search Box) */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-xl">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="พิมพ์คำค้น เช่น Software Engineer หรือ SFIA..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition"
            >
              <FaSearch size={16} />
            </button>
          </div>
        </div>

        {/* แสดงผลลัพธ์ */}
        {query ? (
          <div>
            <div className="mb-6 text-center">
              <span className="text-gray-600">
                แสดงผลลัพธ์สำหรับคำว่า&nbsp;
                <span className="font-medium text-blue-600">{query}</span>
              </span>
            </div>

            {pageItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col justify-between"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        กรอบสมรรถนะ: {item.framework}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => navigate(`/occupation/${item.id}`)}
                        className="w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full transition"
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                ไม่พบผลลัพธ์ที่ตรงกับคำค้น “{query}”
              </p>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  className={`
                    px-3 py-1 rounded-full transition
                    ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                  `}
                >
                  ◀
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`
                        px-3 py-1 rounded-full transition
                        ${
                          page === currentPage
                            ? "bg-blue-500 text-white shadow-lg"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }
                      `}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                  className={`
                    px-3 py-1 rounded-full transition
                    ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                  `}
                >
                  ▶
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">กำลังโหลดคำค้นหา...</p>
        )}
      </div>
    </Layout>
  );
};

export default ResultsPage;
