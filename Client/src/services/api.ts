import axios from "axios";
import { refreshAccessToken } from "@Services/competency/authService";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true,
});

let interceptorsInitialized = false;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (error: Error | unknown) => void;
}> = [];

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

export const scheduleTokenRefresh = (expiresIn: number) => {
  if (refreshTimeout) clearTimeout(refreshTimeout);

  const delay = Math.max((expiresIn - 10) * 1000, 0);
  refreshTimeout = setTimeout(async () => {
    try {
      const { accessToken, expiresIn: nextExpires } = await refreshAccessToken();
      localStorage.setItem("token", accessToken);
      localStorage.setItem("expiresIn", nextExpires.toString());
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      scheduleTokenRefresh(nextExpires);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
    }
  }, delay);
};

export function initApiInterceptors() {
  if (interceptorsInitialized) return;
  interceptorsInitialized = true;

  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (!originalRequest || originalRequest._retry) return Promise.reject(error);

      const status = error.response?.status;
      const url = originalRequest.url || "";

      if (status === 403) {
        window.location.replace("/error403");
        return Promise.reject(error);
      }

      if (status === 401 && !url.includes("/competency/auth/login") && !url.includes("/competency/auth/refresh-token")) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
        }

        isRefreshing = true;

        try {
          const { accessToken, expiresIn } = await refreshAccessToken();

          localStorage.setItem("token", accessToken);
          localStorage.setItem("expiresIn", expiresIn.toString());
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          scheduleTokenRefresh(expiresIn);

          return api(originalRequest);
        } catch (refreshError) {
          if (refreshError instanceof Error) {
            processQueue(refreshError, null);
          } else {
            processQueue(new Error("Unknown error"), null);
          }

          localStorage.removeItem("token");
          localStorage.removeItem("expiresIn");

          window.location.replace("/Home");

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}

export default api;
