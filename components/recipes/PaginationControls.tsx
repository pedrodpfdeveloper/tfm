"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
}

export default function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-12">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary)] hover:text-[var(--background)] transition-colors"
            >
                Anterior
            </button>
            <span>
                Página {currentPage} de {totalPages}
            </span>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary)] hover:text-[var(--background)] transition-colors"
            >
                Siguiente
            </button>
        </div>
    );
}