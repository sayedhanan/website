// src/components/blog/Pagination.tsx
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="mt-8 flex justify-center space-x-2">
      {currentPage > 1 && (
        <Link href={`/blog?page=${currentPage - 1}`} className="btn btn-outline">
          Prev
        </Link>
      )}
      {pages.map(page => (
        <Link
          key={page}
          href={`/blog?page=${page}`}
          className={`btn ${page === currentPage ? "btn-primary" : "btn-secondary"}`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={`/blog?page=${currentPage + 1}`} className="btn btn-outline">
          Next
        </Link>
      )}
    </nav>
  );
}
