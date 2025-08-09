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
  for (let i = 0; i < 9; i++) sum += (10 - i) * Number(s[i]);
  const checkChar = s[9];
  const checkVal = checkChar === "X" ? 10 : Number(checkChar);
  sum += checkVal;
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

/** Zod schema for the search form */
export const deleteByIsbnSchema = z.object({
  isbn: z
    .string()
    .trim()
    .min(1, "The ISBN must not be empty.")
    .refine(
      (v) => v.replace(/[-\s]/g, "").length >= 10,
      "The ISBN must be at least 10 characters long."
    )
    .refine(isValidIsbn, "Invalid ISBN (must be ISBN-10 or ISBN-13)."),
});

export type DeleteByIsbnFields = z.infer<typeof deleteByIsbnSchema>;
