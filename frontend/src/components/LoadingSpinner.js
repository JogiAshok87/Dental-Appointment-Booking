import React from 'react';

export default function LoadingSpinner({ fullScreen = false, size = 'md', text = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
        style={{ borderWidth: '3px' }} />
      {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 rounded-xl bg-slate-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-3.5 bg-slate-200 rounded w-1/2" />
          <div className="h-3.5 bg-slate-200 rounded w-2/3" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-4/5" />
      </div>
      <div className="h-9 bg-slate-200 rounded-xl w-full" />
    </div>
  );
}
