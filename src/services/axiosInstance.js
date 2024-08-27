import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "https://quizzapp-server-production.up.railway.app/api",
  baseURL: "https://test-app-lw9t.onrender.com/api",
});

export const setAxiosInstanceToken = (token) => {
  axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
};
