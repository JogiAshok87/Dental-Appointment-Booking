import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminAppointments from './admin/AdminAppointments';
import AdminDentists from './admin/AdminDentists';
import AdminOverview from './admin/AdminOverview';

const navItems = [
  { to: '', end: true, icon: '📊', label: 'Overview' },
  { to: 'appointments', icon: '📅', label: 'Appointments' },
  { to: 'dentists', icon: '👨‍⚕️', label: 'Dentists' },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 w-64 bg-charcoal flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.5 2 6 4.5 6 7c0 1.8.9 3.4 2.3 4.4C7.5 12.5 7 14 7 15.5c0 3 1.5 5.5 3 6.5.5.3 1 .5 1.5.5h1c.5 0 1-.2 1.5-.5 1.5-1 3-3.5 3-6.5 0-1.5-.5-3-1.3-4.1C17.1 10.4 18 8.8 18 7c0-2.5-2.5-5-6-5z"/>
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">DentiCare</p>
              <p className="text-slate-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
              {admin?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{admin?.username}</p>
              <p className="text-slate-400 text-xs capitalize">{admin?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={`/admin${item.to ? `/${item.to}` : ''}`}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>🌐</span> View Site
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 px-4 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-sm font-semibold text-slate-700">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Online
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="dentists" element={<AdminDentists />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
