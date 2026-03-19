import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-charcoal text-white mt-auto">
    <div className="page-container py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.5 2 6 4.5 6 7c0 1.8.9 3.4 2.3 4.4C7.5 12.5 7 14 7 15.5c0 3 1.5 5.5 3 6.5.5.3 1 .5 1.5.5h1c.5 0 1-.2 1.5-.5 1.5-1 3-3.5 3-6.5 0-1.5-.5-3-1.3-4.1C17.1 10.4 18 8.8 18 7c0-2.5-2.5-5-6-5z"/>
              </svg>
            </div>
            <span className="font-display text-lg font-bold">DentiCare</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Connecting patients with the best dental professionals. Book appointments with ease and confidence.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-slate-200">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
            <li><Link to="/dentists" className="hover:text-primary-400 transition-colors">Find Dentists</Link></li>
            <li><Link to="/admin/login" className="hover:text-primary-400 transition-colors">Admin Portal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-slate-200">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span>📧</span> support@denticare.com
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span> +91-1800-DENTIST
            </li>
            <li className="flex items-center gap-2">
              <span>⏰</span> Mon–Sat, 9AM–6PM
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-500">
        <p>© 2024 DentiCare. All rights reserved.</p>
        <p>Built with ❤️ using MERN Stack</p>
      </div>
    </div>
  </footer>
);

export default Footer;
