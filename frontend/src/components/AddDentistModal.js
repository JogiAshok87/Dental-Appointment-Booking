import React, { useState } from 'react';
import { api } from '../utils/api';

const blank = {
  name: '', qualification: '', specialization: '', yearsOfExperience: '',
  clinicName: '', address: '', location: '', phone: '', email: '',
  consultationFee: '', photo: '', rating: '4.5',
};

export default function AddDentistModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.qualification.trim()) e.qualification = 'Qualification required';
    if (!form.yearsOfExperience) e.yearsOfExperience = 'Experience required';
    if (!form.clinicName.trim()) e.clinicName = 'Clinic name required';
    if (!form.address.trim()) e.address = 'Address required';
    if (!form.location.trim()) e.location = 'Location required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await api.addDentist({
        ...form,
        yearsOfExperience: parseInt(form.yearsOfExperience),
        consultationFee: form.consultationFee ? parseInt(form.consultationFee) : 500,
        rating: parseFloat(form.rating),
      });
      onSuccess();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-charcoal">Add New Dentist</h2>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name *" error={errors.name}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. John Smith" className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
              </Field>
              <Field label="Qualification *" error={errors.qualification}>
                <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="BDS, MDS" className={`input-field ${errors.qualification ? 'border-red-400' : ''}`} />
              </Field>
              <Field label="Specialization">
                <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="e.g. Orthodontics" className="input-field" />
              </Field>
              <Field label="Years of Experience *" error={errors.yearsOfExperience}>
                <input name="yearsOfExperience" type="number" min="0" value={form.yearsOfExperience} onChange={handleChange} placeholder="e.g. 10" className={`input-field ${errors.yearsOfExperience ? 'border-red-400' : ''}`} />
              </Field>
              <Field label="Clinic Name *" error={errors.clinicName}>
                <input name="clinicName" value={form.clinicName} onChange={handleChange} placeholder="Clinic / Hospital name" className={`input-field ${errors.clinicName ? 'border-red-400' : ''}`} />
              </Field>
              <Field label="Location *" error={errors.location}>
                <input name="location" value={form.location} onChange={handleChange} placeholder="City, e.g. Hyderabad" className={`input-field ${errors.location ? 'border-red-400' : ''}`} />
              </Field>
              <Field label="Address *" error={errors.address} className="sm:col-span-2">
                <input name="address" value={form.address} onChange={handleChange} placeholder="Full clinic address" className={`input-field ${errors.address ? 'border-red-400' : ''}`} />
              </Field>
              <Field label="Phone">
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91-XXXXXXXXXX" className="input-field" />
              </Field>
              <Field label="Email">
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@clinic.com" className="input-field" />
              </Field>
              <Field label="Consultation Fee (₹)">
                <input name="consultationFee" type="number" min="0" value={form.consultationFee} onChange={handleChange} placeholder="e.g. 500" className="input-field" />
              </Field>
              <Field label="Rating (0–5)">
                <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} className="input-field" />
              </Field>
              <Field label="Photo URL" className="sm:col-span-2">
                <input name="photo" value={form.photo} onChange={handleChange} placeholder="https://..." className="input-field" />
              </Field>
            </div>

            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{errors.submit}</div>
            )}

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : '+ Add Dentist'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
