import React from 'react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPages = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      pages.push(i);
    }
    if (page - delta > 2) pages.unshift('...');
    if (page + delta < totalPages - 1) pages.push('...');
    pages.unshift(1);
    if (totalPages > 1) pages.push(totalPages);
    return [...new Set(pages)];
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{start}–{end}</span> of{' '}
        <span className="font-semibold text-slate-700">{total}</span> dentists
      </p>
      <div className="flex items-center gap-1">
        <PageBtn onClick={() => onPageChange(page - 1)} disabled={page === 1} label="←" />
        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-slate-400">…</span>
          ) : (
            <PageBtn key={p} onClick={() => onPageChange(p)} active={p === page} label={p} />
          )
        )}
        <PageBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages} label="→" />
      </div>
    </div>
  );
}

function PageBtn({ onClick, disabled, active, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-primary-600 text-white shadow-sm'
          : disabled
          ? 'text-slate-300 cursor-not-allowed'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  );
}
