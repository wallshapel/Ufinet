import type { Book } from "./books/Book";

export type Props = {
  books: Book[];
  onDelete: (isbn: string) => void;
};
