import React from 'react';

const config = {
  Booked:    { cls: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500',   icon: '📅' },
  Confirmed: { cls: 'bg-teal-100 text-teal-700',   dot: 'bg-teal-500',   icon: '✅' },
  Completed: { cls: 'bg-green-100 text-green-700', dot: 'bg-green-500',  icon: '🎉' },
  Cancelled: { cls: 'bg-red-100 text-red-700',     dot: 'bg-red-400',    icon: '❌' },
};

export default function StatusBadge({ status }) {
  const c = config[status] || config.Booked;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
