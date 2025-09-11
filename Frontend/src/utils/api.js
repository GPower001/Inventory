// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // For Vite
//   // For React (non-Vite), use:
//   // baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
//   withCredentials: true, // If cookies are required
// });

// export default api;


import axios from "axios";
import { useAuthStore } from "../store/useAuthStore"; // adjust path if needed

// Always hit backend API through /api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Request interceptor to attach token + branchId
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token || localStorage.getItem("token");
    const branchId = useAuthStore.getState().branchId || localStorage.getItem("branchId");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (branchId) {
      config.headers["x-branch-id"] = branchId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

