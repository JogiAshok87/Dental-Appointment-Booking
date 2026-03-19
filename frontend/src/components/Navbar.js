import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, admin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/60 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-sm group-hover:shadow-glow transition-shadow duration-300">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-lg text-charcoal leading-none block">DentCare</span>
              <span className="text-xs text-slate-500 leading-none">Appointment Booking</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Find Dentists
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive('/admin') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Admin Panel
                </Link>
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">{admin?.username?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{admin?.username}</span>
                  <button onClick={handleLogout} className="ml-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/admin/login" className="btn-primary text-sm py-2 px-4">
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 animate-slide-down">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
              Find Dentists
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                  Admin Panel
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg">
                Admin Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
