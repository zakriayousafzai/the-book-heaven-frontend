"use client";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisible - 1);

            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push("...");
            }

            for (let i = start; i <= end; i++) pages.push(i);

            if (end < totalPages) {
                if (end < totalPages - 1) pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-surface border border-border text-textPrimary
                           hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Previous
            </button>

            {getPageNumbers().map((page, index) =>
                page === "..." ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="px-2 py-1.5 text-textSecondary text-sm">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            currentPage === page
                                ? "bg-primary text-white"
                                : "bg-surface border border-border text-textPrimary hover:bg-secondary"
                        }`}>
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-surface border border-border text-textPrimary
                           hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Next
            </button>
        </div>
    );
};

export default Pagination;
