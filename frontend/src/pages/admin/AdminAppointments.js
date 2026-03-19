import React, { useState, useCallback, useEffect } from 'react';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';

const STATUS_OPTIONS = ['Booked', 'Confirmed', 'Completed', 'Cancelled'];
const STATUS_COLORS = {
  Booked: 'status-booked',
  Confirmed: 'status-confirmed',
  Completed: 'status-completed',
  Cancelled: 'status-cancelled',
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.getAppointments(params);
      setAppointments(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      setConfirmDelete(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">Appointments</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {pagination.total ?? 0} total appointments
          </p>
        </div>
        <button onClick={fetchAppointments} className="btn-secondary text-sm py-2 flex items-center gap-1.5 self-start">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by patient name..."
            className="input-field pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field sm:w-40"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }} className="btn-secondary text-sm py-2 px-4">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" text="Loading appointments..." /></div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-slate-600 font-medium">{error}</p>
            <button onClick={fetchAppointments} className="btn-primary mt-4">Retry</button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-5xl mb-3">📭</p>
            <p className="font-medium">No appointments found</p>
            <p className="text-sm mt-1">
              {search || statusFilter ? 'Try changing your filters.' : 'Appointments will appear here once booked.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['Patient', 'Age', 'Gender', 'Dentist', 'Clinic', 'Date', 'Reason', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {appointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">{apt.patientName}</td>
                      <td className="px-4 py-3 text-slate-500">{apt.age}</td>
                      <td className="px-4 py-3 text-slate-500">{apt.gender}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{apt.dentist?.name || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{apt.dentist?.clinicName || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(apt.appointmentDate).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-[120px] truncate">{apt.reason || '—'}</td>
                      <td className="px-4 py-3">
                        {updatingId === apt._id ? (
                          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <select
                            value={apt.status}
                            onChange={(e) => handleStatusUpdate(apt._id, e.target.value)}
                            className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                              apt.status === 'Booked' ? 'bg-blue-100 text-blue-700' :
                              apt.status === 'Confirmed' ? 'bg-teal-100 text-teal-700' :
                              apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}
                          >
                            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setConfirmDelete(apt._id)}
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 pb-5">
              <Pagination
                pagination={pagination}
                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative card p-6 w-full max-w-sm text-center animate-scale-in">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-charcoal mb-2">Delete Appointment?</h3>
            <p className="text-slate-500 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
                className="btn-danger flex-1 flex items-center justify-center gap-1"
              >
                {deletingId === confirmDelete
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</>
                  : 'Delete'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
