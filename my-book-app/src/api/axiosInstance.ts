import axios from "axios";
import BASE_URL from "./apiConfig";
import { getToken } from "../utils/decodeToken";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
