import type { Genre } from "../types/genres/Genre";
import type { NewGenre } from "../types/genres/NewGenre";
import { getAuthData } from "../utils/decodeToken";
import axiosInstance from "./axiosInstance";

export async function fetchGenresByUser(): Promise<Genre[]> {
  const { userId } = getAuthData();

  const response = await axiosInstance.get<Genre[]>(`/genres/user/${userId}`);

  return response.data;
}

export async function createGenre(
  data: NewGenre
): Promise<{ id: number; name: string }> {
  const response = await axiosInstance.post(`/genres`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
