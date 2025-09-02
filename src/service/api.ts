import { API_BASE_URL } from "../utils/constants";
import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    config.headers["refresh-token"] = refreshToken;
  }
  return config;
});
export default api;
