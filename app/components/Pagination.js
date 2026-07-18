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
        <div className="flex items-center justify-center gap-2 mt-12 w-full py-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-900/60 border border-zinc-800/80 text-zinc-300
                           hover:bg-zinc-850 hover:text-textPrimary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-zinc-900/60 disabled:hover:text-zinc-300 transition-all duration-155 active:scale-[0.97]"
                aria-label="Previous page">
                Prev
            </button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-zinc-500 font-mono text-xs select-none">
                            &bull;&bull;&bull;
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-9 h-9 rounded-full text-xs font-mono transition-all duration-155 flex items-center justify-center active:scale-[0.95] ${
                                currentPage === page
                                    ? "bg-primary text-white border border-primary/20 shadow-md shadow-primary/10"
                                    : "bg-zinc-900/40 border border-zinc-800/60 text-zinc-400 hover:bg-zinc-800/60 hover:text-textPrimary"
                            }`}
                            aria-label={`Go to page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}>
                            {page}
                        </button>
                    )
                )}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-900/60 border border-zinc-800/80 text-zinc-300
                           hover:bg-zinc-850 hover:text-textPrimary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-zinc-900/60 disabled:hover:text-zinc-300 transition-all duration-155 active:scale-[0.97]"
                aria-label="Next page">
                Next
            </button>
        </div>
    );
};

export default Pagination;
