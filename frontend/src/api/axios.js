import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshRequest = null;

const shouldSkipRefresh = (config) => {
  const url = config?.url || "";

  return (
    config?.skipAuthRefresh ||
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh") ||
    url.includes("/health")
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      !originalRequest ||
      originalRequest._authRetry ||
      shouldSkipRefresh(originalRequest) ||
      (status !== 401 && status !== 403)
    ) {
      return Promise.reject(error);
    }

    originalRequest._authRetry = true;

    if (!refreshRequest) {
      refreshRequest = refreshClient.post("/auth/refresh").finally(() => {
        refreshRequest = null;
      });
    }

    try {
      await refreshRequest;
      return api(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  }
);

export default api;
