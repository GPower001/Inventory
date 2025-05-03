import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // For Vite
  // For React (non-Vite), use:
  // baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  withCredentials: true, // If cookies are required
});

export default api;