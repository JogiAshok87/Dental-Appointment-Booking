import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import DentistCard from '../components/DentistCard';
import BookingModal from '../components/BookingModal';
import SearchFilter from '../components/SearchFilter';
import Pagination from '../components/Pagination';
import { SkeletonCard } from '../components/LoadingSpinner';
import { api } from '../utils/api';

const DentistsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dentists, setDentists] = useState([]);
  const [pagination, setPagination] = useState({});
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState(null);

  const search = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchDentists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (location) params.location = location;
      const res = await api.getDentists(params);
      setDentists(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, location, page]);

  useEffect(() => {
    fetchDentists();
  }, [fetchDentists]);

  useEffect(() => {
    api.getLocations()
      .then(res => setLocations(res.data))
      .catch(() => {});
  }, []);

  const updateParams = (updates) => {
    const current = Object.fromEntries(searchParams);
    const next = { ...current, ...updates };
    // Remove empty
    Object.keys(next).forEach(k => !next[k] && delete next[k]);
    setSearchParams(next);
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-teal-700 py-12">
        <div className="page-container text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Find Your Dentist</h1>
          <p className="text-white/70">
            {pagination.total
              ? `${pagination.total} verified dental professionals near you`
              : 'Browse our network of dental specialists'}
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Search filter */}
        <div className="-mt-6 mb-8">
          <SearchFilter
            search={search}
            location={location}
            locations={locations}
            onSearch={(v) => updateParams({ search: v, page: '' })}
            onLocation={(v) => updateParams({ location: v, page: '' })}
            onClear={() => setSearchParams({})}
          />
        </div>

        {/* Active filters */}
        {(search || location) && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-sm text-slate-500">Filters:</span>
            {search && (
              <span className="badge bg-primary-100 text-primary-700 gap-1">
                🔍 {search}
                <button onClick={() => updateParams({ search: '', page: '' })} className="ml-1 hover:text-primary-900">×</button>
              </span>
            )}
            {location && (
              <span className="badge bg-teal-100 text-teal-700 gap-1">
                📍 {location}
                <button onClick={() => updateParams({ location: '', page: '' })} className="ml-1 hover:text-teal-900">×</button>
              </span>
            )}
          </div>
        )}

        {/* Results count */}
        {!loading && !error && (
          <p className="text-sm text-slate-500 mb-6">
            {dentists.length === 0
              ? 'No dentists found'
              : `Showing ${dentists.length} of ${pagination.total} dentists`}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">😞</p>
            <h3 className="font-semibold text-lg text-slate-700 mb-2">Failed to Load Dentists</h3>
            <p className="text-slate-500 mb-4 text-sm">{error}</p>
            <button onClick={fetchDentists} className="btn-primary">Try Again</button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : !error && dentists.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🦷</p>
            <h3 className="font-display text-xl font-bold text-slate-700 mb-2">No Dentists Found</h3>
            <p className="text-slate-500 mb-6">
              {search || location
                ? 'Try adjusting your search filters.'
                : 'No dentists available yet.'}
            </p>
            {(search || location) && (
              <button onClick={() => setSearchParams({})} className="btn-primary">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dentists.map((dentist) => (
                <DentistCard
                  key={dentist._id}
                  dentist={dentist}
                  onBook={setSelectedDentist}
                />
              ))}
            </div>
            <Pagination
              pagination={pagination}
              onPageChange={(p) => {
                updateParams({ page: p.toString() });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </div>

      {/* Booking modal */}
      {selectedDentist && (
        <BookingModal
          dentist={selectedDentist}
          onClose={() => setSelectedDentist(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default DentistsPage;
