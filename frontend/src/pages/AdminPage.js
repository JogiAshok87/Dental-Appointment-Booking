import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppointments, useAppointmentStats } from '../hooks/useData';
import { useDentists } from '../hooks/useData';
import { api } from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import AddDentistModal from '../components/AddDentistModal';
import Pagination from '../components/Pagination';

const TABS = ['Appointments', 'Dentists'];

export default function AdminPage() {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = useState('Appointments');
  const [showAddDentist, setShowAddDentist] = useState(false);

  // Appointments state
  const [aptPage, setAptPage] = useState(1);
  const [aptSearch, setAptSearch] = useState('');
  const [aptStatus, setAptStatus] = useState('');
  const [aptSearchInput, setAptSearchInput] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const { stats } = useAppointmentStats();
  const { appointments, pagination: aptPagination, loading: aptLoading, error: aptError, refetch: refetchApts } = useAppointments({
    page: aptPage, limit: 15,
    ...(aptSearch && { search: aptSearch }),
    ...(aptStatus && { status: aptStatus }),
  });

  // Dentists state
  const [dentPage, setDentPage] = useState(1);
  const { dentists, pagination: dentPagination, loading: dentLoading, refetch: refetchDents } = useDentists({ page: dentPage, limit: 10 });

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.updateAppointmentStatus(id, newStatus);
      refetchApts();
    } catch (e) { alert(e.message); }
    finally { setUpdatingId(null); }
  };

  const handleDeleteApt = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await api.deleteAppointment(id);
      refetchApts();
    } catch (e) { alert(e.message); }
  };

  const handleDeleteDentist = async (id) => {
    if (!window.confirm('Remove this dentist?')) return;
    try {
      await api.deleteDentist(id);
      refetchDents();
    } catch (e) { alert(e.message); }
  };

  const statCards = [
    { label: 'Total', value: stats?.total ?? '–', color: 'from-slate-500 to-slate-600', icon: '📋' },
    { label: 'Booked', value: stats?.booked ?? '–', color: 'from-blue-500 to-blue-600', icon: '📅' },
    { label: 'Confirmed', value: stats?.confirmed ?? '–', color: 'from-teal-500 to-teal-600', icon: '✅' },
    { label: 'Completed', value: stats?.completed ?? '–', color: 'from-green-500 to-green-600', icon: '🎉' },
    { label: 'Cancelled', value: stats?.cancelled ?? '–', color: 'from-red-400 to-red-500', icon: '❌' },
    { label: 'Today', value: stats?.today ?? '–', color: 'from-primary-500 to-primary-600', icon: '🗓️' },
  ];

  return (
    <div className="page-container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-charcoal">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, <span className="font-semibold text-primary-600">{admin?.username}</span></p>
        </div>
        {activeTab === 'Dentists' && (
          <button onClick={() => setShowAddDentist(true)} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Dentist
          </button>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {statCards.map(({ label, value, color, icon }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2 text-lg shadow-sm`}>
              {icon}
            </div>
            <div className="font-display font-bold text-2xl text-charcoal">{value}</div>
            <div className="text-xs text-slate-500 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments tab */}
      {activeTab === 'Appointments' && (
        <div>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <form onSubmit={e => { e.preventDefault(); setAptSearch(aptSearchInput); setAptPage(1); }} className="flex gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={aptSearchInput}
                  onChange={e => setAptSearchInput(e.target.value)}
                  placeholder="Search patient name..."
                  className="input-field pl-9"
                />
              </div>
              <button type="submit" className="btn-primary px-4 py-2 text-sm">Search</button>
              {aptSearch && <button type="button" onClick={() => { setAptSearch(''); setAptSearchInput(''); setAptPage(1); }} className="btn-secondary px-3 py-2 text-sm">Clear</button>}
            </form>
            <select value={aptStatus} onChange={e => { setAptStatus(e.target.value); setAptPage(1); }} className="input-field max-w-[160px]">
              <option value="">All Status</option>
              <option value="Booked">Booked</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {aptError ? (
            <div className="text-center py-10 text-red-600">{aptError}</div>
          ) : aptLoading ? (
            <div className="space-y-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-16 skeleton rounded-xl" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📭</div>
              <h3 className="font-semibold text-lg text-charcoal mb-1">No appointments found</h3>
              <p className="text-slate-500 text-sm">Try adjusting filters</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-100 shadow-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      {['Patient', 'Age / Gender', 'Date', 'Dentist', 'Clinic', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt, i) => (
                      <tr key={apt._id} className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                        <td className="px-4 py-3.5 font-medium text-charcoal">{apt.patientName}</td>
                        <td className="px-4 py-3.5 text-slate-600">{apt.age} · {apt.gender}</td>
                        <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                          {new Date(apt.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3.5 text-slate-700 font-medium">{apt.dentist?.name || '—'}</td>
                        <td className="px-4 py-3.5 text-slate-600">{apt.dentist?.clinicName || '—'}</td>
                        <td className="px-4 py-3.5">
                          <select
                            value={apt.status}
                            onChange={e => handleStatusChange(apt._id, e.target.value)}
                            disabled={updatingId === apt._id}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
                          >
                            {['Booked','Confirmed','Completed','Cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3.5">
                          <button onClick={() => handleDeleteApt(apt._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {appointments.map(apt => (
                  <div key={apt._id} className="card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-charcoal">{apt.patientName}</p>
                        <p className="text-xs text-slate-500">{apt.age} · {apt.gender}</p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                    <div className="space-y-1 text-xs text-slate-600 mb-3">
                      <p>📅 {new Date(apt.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      <p>👨‍⚕️ {apt.dentist?.name}</p>
                      <p>🏥 {apt.dentist?.clinicName}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <select value={apt.status} onChange={e => handleStatusChange(apt._id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white">
                        {['Booked','Confirmed','Completed','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => handleDeleteApt(apt._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Pagination pagination={aptPagination} onPageChange={setAptPage} />
            </>
          )}
        </div>
      )}

      {/* Dentists tab */}
      {activeTab === 'Dentists' && (
        <div>
          {dentLoading ? (
            <div className="space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-100 shadow-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      {['Photo', 'Name', 'Specialization', 'Experience', 'Clinic', 'Location', 'Fee', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dentists.map((d, i) => (
                      <tr key={d._id} className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                        <td className="px-4 py-3">
                          <img src={d.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=0ea5e9&color=fff`}
                            alt={d.name} className="w-9 h-9 rounded-lg object-cover"
                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=0ea5e9&color=fff`; }} />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-charcoal">{d.name}</p>
                          <p className="text-xs text-slate-500">{d.qualification}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{d.specialization}</td>
                        <td className="px-4 py-3 text-slate-600">{d.yearsOfExperience} yrs</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">{d.clinicName}</td>
                        <td className="px-4 py-3 text-slate-600">{d.location}</td>
                        <td className="px-4 py-3 text-slate-600">₹{d.consultationFee}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteDentist(d._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile dentist cards */}
              <div className="md:hidden space-y-3">
                {dentists.map(d => (
                  <div key={d._id} className="card p-4 flex items-center gap-3">
                    <img src={d.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=0ea5e9&color=fff`}
                      alt={d.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=0ea5e9&color=fff`; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal truncate">{d.name}</p>
                      <p className="text-xs text-primary-600">{d.specialization}</p>
                      <p className="text-xs text-slate-500">{d.clinicName} · {d.location}</p>
                    </div>
                    <button onClick={() => handleDeleteDentist(d._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <Pagination pagination={dentPagination} onPageChange={setDentPage} />
            </>
          )}
        </div>
      )}

      {showAddDentist && (
        <AddDentistModal
          onClose={() => setShowAddDentist(false)}
          onSuccess={() => { setShowAddDentist(false); refetchDents(); }}
        />
      )}
    </div>
  );
}
