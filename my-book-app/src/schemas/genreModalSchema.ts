import { z } from "zod";

/** Zod schema for GenreModal */
export const genreModalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "The gender name is mandatory.")
    .max(100, "The name is too long."),
});

export type GenreModalFields = z.infer<typeof genreModalSchema>;
