import Link from 'next/link';

export default function CarsPagination({ page, totalPages, searchParams }) {
  if (totalPages <= 1) return null;

  const buildHref = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    return `?${params.toString()}`;
  };

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between mt-10 pt-6 border-t border-white/10"
    >
      {/* Previous */}
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Link>
      ) : (
        <span className="text-sm font-semibold text-white/20 cursor-not-allowed flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </span>
      )}

      {/* Numbers */}
      <div className="flex items-center gap-1">
        {start > 1 && (
          <>
            <PageLink href={buildHref(1)} active={page === 1}>1</PageLink>
            {start > 2 && <span className="px-2 text-white/40">…</span>}
          </>
        )}
        {pages.map((p) => (
          <PageLink key={p} href={buildHref(p)} active={p === page}>{p}</PageLink>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2 text-white/40">…</span>}
            <PageLink href={buildHref(totalPages)} active={page === totalPages}>{totalPages}</PageLink>
          </>
        )}
      </div>

      {/* Next */}
      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="text-sm font-semibold text-white/20 cursor-not-allowed flex items-center gap-2">
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}

function PageLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`min-w-[36px] h-9 flex items-center justify-center text-sm font-semibold transition-colors ${
        active
          ? 'bg-white text-black'
          : 'text-white/70 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
}