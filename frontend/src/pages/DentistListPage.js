import React, { useState, useCallback } from 'react';
import { useDentists } from '../hooks/useData';
import DentistCard from '../components/DentistCard';
import BookingModal from '../components/BookingModal';
import Pagination from '../components/Pagination';
import { SkeletonCard } from '../components/LoadingSpinner';

const LOCATIONS = ['All Locations', 'Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Pune', 'Kolkata'];

export default function DentistListPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const params = { page, limit: 9, ...(search && { search }), ...(location && { location }) };
  const { dentists, pagination, loading, error } = useDentists(params);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleLocationChange = (loc) => {
    setLocation(loc === 'All Locations' ? '' : loc);
    setPage(1);
  };

  const handleBookSuccess = () => {
    setSuccessMsg('');
    setSelectedDentist(null);
    setTimeout(() => setSuccessMsg('Appointment booked successfully!'), 100);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="pb-16">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-mesh-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

        <div className="page-container relative py-14 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Trusted by 10,000+ patients
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
              Your Smile Deserves the<br />
              <span className="text-teal-300">Best Dental Care</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Book appointments with top-rated dentists near you. Fast, easy, and hassle-free.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
              <div className="flex-1 relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search dentist or specialization..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                />
              </div>
              <button type="submit" className="bg-white text-primary-700 font-semibold px-5 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                Search
              </button>
            </form>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              {[['500+', 'Expert Dentists'], ['50+', 'Cities'], ['4.8★', 'Avg Rating']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display font-bold text-2xl text-white">{val}</div>
                  <div className="text-white/70 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-down">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMsg}
        </div>
      )}

      <div className="page-container mt-8">
        {/* Location filter + results count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-charcoal">
              {search ? `Results for "${search}"` : 'All Dentists'}
            </h2>
            {pagination && (
              <p className="text-sm text-slate-500 mt-0.5">{pagination.total} dentists available</p>
            )}
          </div>
          {/* Location pills */}
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map(loc => (
              <button
                key={loc}
                onClick={() => handleLocationChange(loc)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  (loc === 'All Locations' && !location) || loc === location
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Active filters */}
        {(search || location) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-slate-500">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full text-xs font-medium">
                Search: {search}
                <button onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} className="hover:text-primary-900 ml-0.5">×</button>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full text-xs font-medium">
                {location}
                <button onClick={() => { setLocation(''); setPage(1); }} className="hover:text-primary-900 ml-0.5">×</button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-2">Failed to load dentists</p>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : dentists.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🦷</div>
            <h3 className="font-display font-bold text-xl text-charcoal mb-2">No dentists found</h3>
            <p className="text-slate-500 mb-5">Try adjusting your search or location filter</p>
            <button onClick={() => { setSearch(''); setSearchInput(''); setLocation(''); setPage(1); }} className="btn-secondary">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {dentists.map(d => (
              <DentistCard key={d._id} dentist={d} onBook={setSelectedDentist} />
            ))}
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={setPage} />
      </div>

      {/* Booking modal */}
      {selectedDentist && (
        <BookingModal
          dentist={selectedDentist}
          onClose={() => setSelectedDentist(null)}
          onSuccess={handleBookSuccess}
        />
      )}
    </div>
  );
}
