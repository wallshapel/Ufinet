// src/types/DeleteByIsbnProps.ts
export type Props = {
  onDelete: (isbn: string) => Promise<void>;
};
