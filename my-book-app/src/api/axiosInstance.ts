import axios from "axios";
import BASE_URL from "./apiConfig";
import { getToken } from "../utils/decodeToken";
import { logoutUser } from "../utils/logoutHelper";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401)
      logoutUser(); // automatic logout
    return Promise.reject(error);
  }
);

export default axiosInstance;
