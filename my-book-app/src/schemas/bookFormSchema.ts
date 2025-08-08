import { z } from "zod";

/** ISBN validation helpers */
function cleanIsbn(raw: string) {
  return raw.replace(/[-\s]/g, "").toUpperCase();
}

function isValidISBN10(raw: string): boolean {
  const s = cleanIsbn(raw);
  if (!/^\d{9}[\dX]$/.test(s)) return false;

  // Formula: (10*d1 + 9*d2 + ... + 2*d9 + 1*check) % 11 === 0
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * Number(s[i]);
  }
  const checkChar = s[9];
  const checkVal = checkChar === "X" ? 10 : Number(checkChar);
  sum += checkVal * 1;

  return sum % 11 === 0;
}

function isValidISBN13(raw: string): boolean {
  const s = cleanIsbn(raw);
  if (!/^\d{13}$/.test(s)) return false;

  // EAN-13: alternating weights 1 and 3
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const n = Number(s[i]);
    sum += i % 2 === 0 ? n : n * 3;
  }
  const check = (10 - (sum % 10)) % 10;
  return check === Number(s[12]);
}

function isValidIsbn(raw: string): boolean {
  const s = cleanIsbn(raw);
  return isValidISBN10(s) || isValidISBN13(s);
}

function isValidDateStr(d: string): boolean {
  const dt = new Date(d);
  return !Number.isNaN(dt.getTime());
}

function isNotFuture(d: string): boolean {
  const dt = new Date(d);
  const today = new Date();
  // We normalise at midnight to avoid time zone/time issues.
  dt.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return dt <= today;
}

/**
 * Schema with strict rules:
 * - isbn: required, trim, valid ISBN10/13 (with checksum)
 * - title: 2..200 characters
 * - genreId: numeric string > 0
 * - publishedDate: valid date, not in the future (YYYY-MM-DD)
 * - synopsis: 10..5000 characters
 *
 * Note: `coverFile` is not validated here because it is not registered in RHF;
 *       we only use it to display manual errors with setError.
 */
export const bookFormSchema = z.object({
  isbn: z
    .string()
    .trim()
    .min(1, "The ISBN is required.")
    .refine(isValidIsbn, "Invalid ISBN (must be ISBN-10 or ISBN-13)."),
  title: z
    .string()
    .trim()
    .min(2, "Title must have at least 2 characters.")
    .max(200, "Title must have at most 200 characters."),
  genreId: z
    .string()
    .min(1, "The genre is required.")
    .refine((v) => /^\d+$/.test(v), "Invalid genre.")
    .refine((v) => Number(v) > 0, "Invalid genre."),
  publishedDate: z
    .string()
    .min(1, "The date is required.")
    .refine(isValidDateStr, "Invalid date.")
    .refine(isNotFuture, "The date cannot be in the future."),
  synopsis: z
    .string()
    .trim()
    .min(10, "Synopsis must have at least 10 characters.")
    .max(5000, "Synopsis is too long."),
});

// Type inferred from the schema.
// Note: we added coverFile only to be able to display errors related to image uploads.
export type BookFormFields = z.infer<typeof bookFormSchema> & {
  coverFile?: File | null;
};
