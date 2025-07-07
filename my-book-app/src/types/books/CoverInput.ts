export type CoverInput = {
  onValidFileSelect: (file: File) => void;
  currentFile?: File;
  showError: (message: string) => void;
};
