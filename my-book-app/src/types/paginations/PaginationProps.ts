export type Props = {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    size: number;
    onSizeChange: (newSize: number) => void;
};