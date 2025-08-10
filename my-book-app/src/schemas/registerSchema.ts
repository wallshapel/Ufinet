import { z } from "zod";

/** Zod schema for register form */
export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "The user name is mandatory."),
  email: z
    .string()
    .trim()
    .min(1, "The e-mail address is compulsory.")
    .email("Invalid e-mail address."),
  password: z
    .string()
    .min(1, "The password is mandatory.")
    .min(6, "Must be at least 6 characters long.")
    .refine((v) => /[A-Za-z]/.test(v), {
      message: "Must contain at least one letter.",
    })
    .refine((v) => /\d/.test(v), {
      message: "Must contain at least one number.",
    }),
});

export type RegisterFormFields = z.infer<typeof registerSchema>;
