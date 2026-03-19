import React from 'react';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-slate-600 ml-0.5 font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function DentistCard({ dentist, onBook }) {
  const fallbackPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(dentist.name)}&background=0ea5e9&color=fff&size=128`;

  return (
    <div className="card card-hover group flex flex-col h-full overflow-hidden animate-fade-in">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-500 to-teal-400" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={dentist.photo || fallbackPhoto}
              alt={dentist.name}
              onError={(e) => { e.target.src = fallbackPhoto; }}
              className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" title="Available" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-charcoal text-lg leading-tight truncate">{dentist.name}</h3>
            <p className="text-primary-600 text-xs font-semibold mt-0.5 bg-primary-50 inline-block px-2 py-0.5 rounded-full">
              {dentist.specialization || 'General Dentistry'}
            </p>
            <p className="text-slate-500 text-xs mt-1">{dentist.qualification}</p>
            <div className="mt-1.5">
              <StarRating rating={dentist.rating || 4.5} />
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="space-y-2 mb-4 flex-1">
          <InfoRow icon="🏥" label={dentist.clinicName} />
          <InfoRow icon="📍" label={`${dentist.address}, ${dentist.location}`} />
          <InfoRow icon="⭐" label={`${dentist.yearsOfExperience} years experience`} />
          <InfoRow icon="💰" label={`₹${dentist.consultationFee || 500} consultation fee`} />
        </div>

        {/* Available days */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-1.5 font-medium">Available on:</p>
          <div className="flex flex-wrap gap-1">
            {(dentist.availableDays || ['Mon', 'Wed', 'Fri']).slice(0, 5).map(day => (
              <span key={day} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-medium">
                {day.slice(0, 3)}
              </span>
            ))}
          </div>
        </div>

        {/* Book button */}
        <button
          onClick={() => onBook(dentist)}
          className="w-full btn-primary flex items-center justify-center gap-2 group/btn"
        >
          <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book Appointment
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-base leading-tight mt-0.5 flex-shrink-0">{icon}</span>
      <span className="text-xs text-slate-600 leading-snug line-clamp-2">{label}</span>
    </div>
  );
}
