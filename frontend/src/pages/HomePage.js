import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '500+', label: 'Dentists', icon: '🦷' },
  { value: '50K+', label: 'Patients', icon: '👥' },
  { value: '20+', label: 'Cities', icon: '🏙️' },
  { value: '4.8★', label: 'Avg Rating', icon: '⭐' },
];

const features = [
  {
    icon: '🔍',
    title: 'Find Specialists',
    desc: 'Browse verified dentists by specialty, location, and availability.',
  },
  {
    icon: '📅',
    title: 'Easy Booking',
    desc: 'Book in under 2 minutes. Choose your preferred date and time.',
  },
  {
    icon: '✅',
    title: 'Instant Confirmation',
    desc: 'Get immediate confirmation with all appointment details.',
  },
  {
    icon: '🏥',
    title: 'Top Clinics',
    desc: 'Access leading dental clinics with state-of-the-art facilities.',
  },
];

const specialties = [
  { name: 'General Dentistry', icon: '🦷', color: 'from-blue-500 to-blue-600' },
  { name: 'Orthodontics', icon: '😁', color: 'from-teal-500 to-teal-600' },
  { name: 'Root Canal', icon: '🔬', color: 'from-orange-500 to-orange-600' },
  { name: 'Cosmetic', icon: '✨', color: 'from-purple-500 to-purple-600' },
  { name: 'Implants', icon: '🦴', color: 'from-green-500 to-green-600' },
  { name: 'Pediatric', icon: '👶', color: 'from-pink-500 to-pink-600' },
];

const HomePage = () => (
  <div className="pt-16">
    {/* Hero */}
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-teal-900" />
      <div className="absolute inset-0 bg-mesh-pattern opacity-20" />
      {/* Floating blobs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative page-container w-full py-20">
        <div className="max-w-2xl animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">500+ Verified Dentists Ready to Help</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Your Perfect
            <br />
            <span className="bg-gradient-to-r from-teal-300 to-primary-300 bg-clip-text text-transparent">
              Smile Starts
            </span>
            <br />
            Here
          </h1>

          <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-xl">
            Connect with top-rated dental specialists across India. 
            Book appointments instantly, no waiting, no hassle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/dentists" className="group inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find a Dentist
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/admin/login" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300">
              Admin Portal
            </Link>
          </div>
        </div>

        {/* Floating card */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 animate-float">
          <div className="glass border border-white/20 rounded-2xl p-5 w-64 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Dr" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Dr. Priya Sharma</p>
                <p className="text-white/60 text-xs">Orthodontist</p>
                <div className="flex text-amber-400 text-xs mt-0.5">★★★★★</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white/60 text-xs mb-1">Next Available</p>
              <p className="text-white font-semibold text-sm">Today, 2:30 PM</p>
            </div>
            <button className="mt-3 w-full bg-gradient-to-r from-primary-400 to-teal-400 text-white text-sm font-medium py-2 rounded-xl">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-4">
              <p className="text-3xl mb-1">{s.icon}</p>
              <p className="font-display text-3xl font-bold text-charcoal">{s.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Specialties */}
    <section className="py-16 page-container">
      <div className="text-center mb-10">
        <h2 className="section-title">Browse by Specialty</h2>
        <p className="text-slate-500 mt-2">Find the right expert for your dental needs</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {specialties.map((sp) => (
          <Link
            key={sp.name}
            to={`/dentists?search=${encodeURIComponent(sp.name)}`}
            className="group card card-hover p-5 text-center cursor-pointer"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${sp.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform`}>
              {sp.icon}
            </div>
            <p className="text-xs font-semibold text-slate-700 group-hover:text-primary-700 transition-colors">
              {sp.name}
            </p>
          </Link>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section className="py-16 bg-white">
      <div className="page-container">
        <div className="text-center mb-12">
          <h2 className="section-title">How It Works</h2>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto">Get your dental appointment in 3 simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Search', desc: 'Browse dentists by specialty, location, or name.', icon: '🔍' },
            { step: '02', title: 'Choose', desc: 'View profiles, ratings, and availability. Pick the best fit.', icon: '✅' },
            { step: '03', title: 'Book', desc: 'Fill in your details, confirm, and you\'re done!', icon: '📅' },
          ].map((s, i) => (
            <div key={s.step} className="relative">
              {i < 2 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent z-10 -translate-x-8" />
              )}
              <div className="card p-6 text-center relative z-20">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {s.icon}
                </div>
                <span className="font-mono text-xs font-bold text-primary-400 tracking-wider">STEP {s.step}</span>
                <h3 className="font-display text-xl font-bold text-charcoal mt-1 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-16 page-container">
      <div className="text-center mb-12">
        <h2 className="section-title">Why Choose DentiCare?</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <div key={f.title} className="card card-hover p-6">
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-semibold text-charcoal mb-2">{f.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 page-container">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 to-teal-700 rounded-3xl p-10 text-center">
        <div className="absolute inset-0 bg-mesh-pattern opacity-10" />
        <div className="relative">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Ready for a Healthier Smile?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
            Join thousands of patients who trust DentiCare for their dental health.
          </p>
          <Link to="/dentists" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-2xl hover:shadow-xl transition-all active:scale-95">
            Book Your Appointment →
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
