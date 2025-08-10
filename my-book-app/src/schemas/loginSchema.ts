import { z } from "zod";

/** Zod schema for login form */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Mail is obligatory.")
    .email("Correo no válido."),
  password: z
    .string()
    .min(1, "The password is mandatory.")
    .min(6, "Must be at least 6 characters long."),
});

export type LoginFormFields = z.infer<typeof loginSchema>;
