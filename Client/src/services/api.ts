import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true,
});

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;

export const scheduleTokenRefresh = (expiresIn: number) => {
  if (refreshTimeout) clearTimeout(refreshTimeout);
  const delay = Math.max((expiresIn - 60) * 1000, 0);

  refreshTimeout = setTimeout(async () => {
    try {
      const res = await api.post("/v0/auth/refresh");
      const { accessToken, expiresIn: newExpiresIn } = res.data || {};

      if (accessToken && newExpiresIn) {
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        scheduleTokenRefresh(newExpiresIn);
      } else {
        alert("Session expired. Please login again.");
        setTimeout(() => (window.location.href = "/home"), 1500);
      }
    } catch {
      alert("Session expired. Please login again.");
      setTimeout(() => (window.location.href = "/home"), 1500);
    }
  }, delay);
};

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  const csrfToken = Cookies.get("csrfToken");
  if (csrfToken) config.headers["X-CSRF-Token"] = csrfToken;
  return config;
});

export default api;
