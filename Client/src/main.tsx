import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Loading } from "@Components/ExportComponent";
import { ThemeProvider } from "@Contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./components/Common/ScrolToTop";
import "./styles/global.css";

import { initApiInterceptors } from "./services/api";

initApiInterceptors();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <ScrollToTop />
      {/* <AuthProvider> */}
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <React.Suspense fallback={<Loading />}>
            <AuthProvider>
              {/* ใน AuthProvider ให้มี logic โหลด token ตอนเริ่ม */}
              <App />
            </AuthProvider>
          </React.Suspense>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
