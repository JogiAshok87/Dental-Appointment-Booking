import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        <p className={`font-display text-3xl font-bold mt-1 ${color}`}>{value ?? '—'}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  </div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, apptRes] = await Promise.all([
          api.getAppointmentStats(),
          api.getAppointments({ limit: 5, sortBy: 'createdAt', order: 'desc' }),
        ]);
        setStats(statsRes.data);
        setRecentAppointments(apptRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" text="Loading dashboard..." />
    </div>
  );

  const statusColors = {
    Booked: 'status-booked',
    Confirmed: 'status-confirmed',
    Completed: 'status-completed',
    Cancelled: 'status-cancelled',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal">Overview</h2>
        <p className="text-slate-500 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon="📋" label="Total" value={stats?.total} color="text-charcoal" />
        <StatCard icon="🔵" label="Booked" value={stats?.booked} color="text-blue-600" />
        <StatCard icon="✅" label="Confirmed" value={stats?.confirmed} color="text-teal-600" />
        <StatCard icon="🏆" label="Completed" value={stats?.completed} color="text-green-600" />
        <StatCard icon="❌" label="Cancelled" value={stats?.cancelled} color="text-red-500" />
        <StatCard icon="📅" label="Today" value={stats?.today} color="text-primary-600" sub="appointments" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '📅', title: 'Manage Appointments', desc: 'View, filter and update appointment status', to: '/admin/appointments', color: 'from-blue-500 to-blue-600' },
          { icon: '👨‍⚕️', title: 'Manage Dentists', desc: 'Add, edit or remove dentist profiles', to: '/admin/dentists', color: 'from-teal-500 to-teal-600' },
          { icon: '🌐', title: 'View Patient Portal', desc: 'See what patients see on the platform', to: '/dentists', color: 'from-purple-500 to-purple-600' },
        ].map((card) => (
          <Link key={card.title} to={card.to} className="card card-hover p-5 flex items-start gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
              {card.icon}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-charcoal">{card.title}</h3>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-charcoal">Recent Appointments</h3>
          <Link to="/admin/appointments" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>
        {recentAppointments.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">No appointments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['Patient', 'Age/Gender', 'Dentist', 'Date', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-charcoal">{apt.patientName}</td>
                    <td className="px-5 py-3 text-slate-500">{apt.age} / {apt.gender}</td>
                    <td className="px-5 py-3 text-slate-600">{apt.dentist?.name || '—'}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(apt.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3">
                      <span className={statusColors[apt.status]}>{apt.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
