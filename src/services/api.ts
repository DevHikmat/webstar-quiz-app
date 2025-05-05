import axios, { AxiosError } from "axios";

// Token olish uchun (localStorage dan)
const getToken = () => {
  return localStorage.getItem("token");
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.log("Request error: ", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          console.error("❗️ Bad Request", error.response.data);
          break;
        case 401:
          console.warn("🔒 Unauthorized - Token invalid or expired");
          // logout() yoki redirect qilish mumkin
          break;
        case 403:
          console.warn("🚫 Forbidden - Access denied");
          break;
        case 404:
          console.warn("🔍 Not Found");
          break;
        case 500:
          console.error("💥 Internal Server Error");
          break;
        default:
          console.error(`🚨 Unexpected error (${status})`);
          break;
      }
    } else if (error.request) {
      console.error("📡 No response from server");
    } else {
      console.error("❌ Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
