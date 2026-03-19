import React, { useState } from 'react';
import { api } from '../utils/api';

const initialForm = { patientName: '', age: '', gender: '', appointmentDate: '', phone: '', email: '', reason: '', notes: '' };
const initialErrors = {};

export default function BookingModal({ dentist, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = 'Patient name is required';
    else if (form.patientName.trim().length < 2) e.patientName = 'Name must be at least 2 characters';
    if (!form.age) e.age = 'Age is required';
    else if (parseInt(form.age) < 1 || parseInt(form.age) > 120) e.age = 'Enter a valid age (1–120)';
    if (!form.gender) e.gender = 'Please select a gender';
    if (!form.appointmentDate) e.appointmentDate = 'Appointment date is required';
    else if (form.appointmentDate < today) e.appointmentDate = 'Date cannot be in the past';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        patientName: form.patientName.trim(),
        age: parseInt(form.age),
        gender: form.gender,
        appointmentDate: form.appointmentDate,
        dentist: dentist._id,
        ...(form.phone && { phone: form.phone }),
        ...(form.email && { email: form.email }),
        ...(form.reason && { reason: form.reason }),
        ...(form.notes && { notes: form.notes }),
      };
      const res = await api.createAppointment(payload);
      setBookingData(res.data);
      setSuccess(true);
      onSuccess && onSuccess(res.data);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (success && bookingData) {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="text-center py-6 animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-2xl text-charcoal mb-2">Appointment Confirmed!</h3>
          <p className="text-slate-500 mb-6 text-sm">Your appointment has been successfully booked.</p>

          <div className="bg-gradient-to-br from-primary-50 to-teal-50 rounded-2xl p-5 text-left mb-6 border border-primary-100">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">Booking Details</h4>
            <div className="space-y-2">
              <DetailRow label="Patient" value={bookingData.patientName} />
              <DetailRow label="Dentist" value={dentist.name} />
              <DetailRow label="Clinic" value={dentist.clinicName} />
              <DetailRow label="Date" value={new Date(bookingData.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
              <DetailRow label="Status" value={
                <span className="status-booked">{bookingData.status}</span>
              } />
            </div>
          </div>

          <button onClick={onClose} className="btn-primary w-full">Done</button>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper onClose={onClose}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-6 pb-5 border-b border-slate-100">
        <img
          src={dentist.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(dentist.name)}&background=0ea5e9&color=fff`}
          alt={dentist.name}
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dentist.name)}&background=0ea5e9&color=fff`; }}
        />
        <div>
          <h2 className="font-display font-bold text-xl text-charcoal">Book Appointment</h2>
          <p className="text-sm text-primary-600 font-medium">{dentist.name} · {dentist.clinicName}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Name */}
        <FormField label="Patient Name *" error={errors.patientName}>
          <input name="patientName" value={form.patientName} onChange={handleChange}
            placeholder="Enter full name" className={`input-field ${errors.patientName ? 'border-red-400 focus:ring-red-400' : ''}`} />
        </FormField>

        {/* Age + Gender row */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Age *" error={errors.age}>
            <input name="age" type="number" value={form.age} onChange={handleChange} min="1" max="120"
              placeholder="e.g. 28" className={`input-field ${errors.age ? 'border-red-400 focus:ring-red-400' : ''}`} />
          </FormField>
          <FormField label="Gender *" error={errors.gender}>
            <select name="gender" value={form.gender} onChange={handleChange}
              className={`input-field ${errors.gender ? 'border-red-400 focus:ring-red-400' : ''}`}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </FormField>
        </div>

        {/* Appointment Date */}
        <FormField label="Appointment Date *" error={errors.appointmentDate}>
          <input name="appointmentDate" type="date" value={form.appointmentDate} onChange={handleChange} min={today}
            className={`input-field ${errors.appointmentDate ? 'border-red-400 focus:ring-red-400' : ''}`} />
        </FormField>

        {/* Phone + Email */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone" error={errors.phone}>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange}
              placeholder="10-digit mobile" className={`input-field ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`} />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@email.com" className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`} />
          </FormField>
        </div>

        {/* Reason */}
        <FormField label="Reason for Visit">
          <select name="reason" value={form.reason} onChange={handleChange} className="input-field">
            <option value="">Select reason (optional)</option>
            <option value="General Checkup">General Checkup</option>
            <option value="Tooth Pain">Tooth Pain</option>
            <option value="Cleaning & Polishing">Cleaning & Polishing</option>
            <option value="Root Canal">Root Canal</option>
            <option value="Braces Consultation">Braces Consultation</option>
            <option value="Tooth Extraction">Tooth Extraction</option>
            <option value="Implant Consultation">Implant Consultation</option>
            <option value="Whitening">Teeth Whitening</option>
            <option value="Other">Other</option>
          </select>
        </FormField>

        {/* Notes */}
        <FormField label="Additional Notes">
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
            placeholder="Any specific concerns or allergies..." className="input-field resize-none" />
        </FormField>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.submit}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm Booking
              </>
            )}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-end mb-1">
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </p>}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
