import axios from "axios";
import BASE_URL from "./apiConfig";
import type { RegisterForm } from "../types/RegisterForm";

export async function registerUser(payload: RegisterForm): Promise<void> {
  try {
    await axios.post(`${BASE_URL}/users/register`, payload);
  } catch (error: any) {
    if (error.response?.data?.message)
      throw new Error(error.response.data.message);
    else {
      console.error(error);
      throw new Error(
        "Fully responsive App. Fully formatted App"
      );
    }
  }
}
