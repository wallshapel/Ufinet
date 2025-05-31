import type { Book } from "./Book";

export type Props = {
    onAdd: (book: Book) => void;
};