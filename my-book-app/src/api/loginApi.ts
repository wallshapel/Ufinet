import axios from "axios";
import type { LoginForm } from "../types/Login";
import BASE_URL from "./apiConfig";

export async function loginUser(payload: LoginForm): Promise<string> {
  const response = await axios.post(`${BASE_URL}/auth/login`, payload);
  return response.data.token;
}
