// File: components/blog/ClientPagination.tsx
'use client';

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ClientPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ClientPaginationProps) {
  // Show at most 7 pages with ellipsis for better UX
  let pagesToShow: (number | string)[] = [];
  
  if (totalPages <= 7) {
    // If we have 7 or fewer pages, show all
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    // Always include first and last page
    if (currentPage <= 4) {
      // Near the start
      pagesToShow = [1, 2, 3, 4, 5, '...', totalPages];
    } else if (currentPage >= totalPages - 3) {
      // Near the end
      pagesToShow = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      // Somewhere in the middle
      pagesToShow = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  }

  return (
    <nav className="mt-8 flex justify-center items-center space-x-2" aria-label="Pagination Navigation">
      {/* Previous Button */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        ← Previous
      </button>
      
      {/* Page Numbers */}
      <div className="flex space-x-1">
        {pagesToShow.map((page, i) => (
          page === '...' ? (
            <span 
              key={`ellipsis-${i}`} 
              className="px-3 py-2 text-[var(--color-secondary-text)]"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`min-w-[44px] h-11 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                page === currentPage 
                  ? "bg-[var(--color-accent)] text-[var(--color-surface)] border border-[var(--color-accent)] shadow-xs font-semibold" 
                  : "bg-[var(--color-surface)] text-[var(--color-primary-text)] border border-[var(--color-border)] hover:bg-[var(--color-background)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]"
              }`}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          )
        ))}
      </div>
      
      {/* Next Button */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}