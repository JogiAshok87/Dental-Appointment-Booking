import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const emptyForm = {
  name: '', photo: '', qualification: '', specialization: 'General Dentistry',
  yearsOfExperience: '', clinicName: '', address: '', location: '',
  phone: '', email: '', rating: 4.5, consultationFee: 500,
  availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
};

const AdminDentists = () => {
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editDentist, setEditDentist] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [imgErrors, setImgErrors] = useState({});

  const fetchDentists = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getDentists({ limit: 50 });
      setDentists(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDentists(); }, [fetchDentists]);

  const openAdd = () => {
    setEditDentist(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (dentist) => {
    setEditDentist(dentist);
    setForm({
      ...emptyForm, ...dentist,
      yearsOfExperience: dentist.yearsOfExperience?.toString() || '',
      consultationFee: dentist.consultationFee?.toString() || '500',
      rating: dentist.rating?.toString() || '4.5',
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.qualification.trim()) errs.qualification = 'Qualification is required';
    if (!form.yearsOfExperience || isNaN(form.yearsOfExperience)) errs.yearsOfExperience = 'Valid years required';
    if (!form.clinicName.trim()) errs.clinicName = 'Clinic name is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        yearsOfExperience: parseInt(form.yearsOfExperience),
        consultationFee: parseFloat(form.consultationFee) || 500,
        rating: parseFloat(form.rating) || 4.5,
      };
      if (editDentist) {
        const res = await api.updateDentist(editDentist._id, payload);
        setDentists((prev) => prev.map((d) => d._id === editDentist._id ? res.data : d));
      } else {
        const res = await api.addDentist(payload);
        setDentists((prev) => [res.data, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.deleteDentist(id);
      setDentists((prev) => prev.filter((d) => d._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">Dentists</h2>
          <p className="text-slate-500 text-sm mt-0.5">{dentists.length} dental professionals</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Dentist
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" text="Loading dentists..." /></div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-slate-600">{error}</p>
          <button onClick={fetchDentists} className="btn-primary mt-4">Retry</button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Dentist', 'Qualification', 'Specialization', 'Experience', 'Clinic', 'Location', 'Fee', 'Rating', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dentists.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {!imgErrors[d._id] && d.photo ? (
                          <img
                            src={d.photo} alt={d.name}
                            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                            onError={() => setImgErrors((prev) => ({ ...prev, [d._id]: true }))}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 font-semibold text-primary-600 text-sm">
                            {d.name.split(' ').filter((_, i) => i > 0)[0]?.[0] || 'D'}
                          </div>
                        )}
                        <span className="font-medium text-charcoal whitespace-nowrap">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{d.qualification}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-teal-50 text-teal-700 border border-teal-100 whitespace-nowrap">{d.specialization}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-center">{d.yearsOfExperience} yrs</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{d.clinicName}</td>
                    <td className="px-4 py-3 text-slate-500">{d.location}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium">₹{d.consultationFee}</td>
                    <td className="px-4 py-3">
                      <span className="text-amber-600 font-medium">★ {d.rating}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(d)}
                          className="text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 py-1 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDelete(d._id)}
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dentists.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p className="text-4xl mb-2">👨‍⚕️</p>
                <p>No dentists yet. Add your first dentist!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-scale-in">
            <div className="h-1.5 bg-gradient-to-r from-primary-500 to-teal-500 rounded-t-2xl" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-xl font-bold text-charcoal">
                  {editDentist ? 'Edit Dentist' : 'Add New Dentist'}
                </h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {formErrors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  ⚠️ {formErrors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name *" error={formErrors.name}>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. Full Name" className="input-field" />
                  </FormField>
                  <FormField label="Qualification *" error={formErrors.qualification}>
                    <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="BDS, MDS (Orthodontics)" className="input-field" />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Specialization">
                    <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="General Dentistry" className="input-field" />
                  </FormField>
                  <FormField label="Years of Experience *" error={formErrors.yearsOfExperience}>
                    <input name="yearsOfExperience" type="number" min="0" value={form.yearsOfExperience} onChange={handleChange} placeholder="10" className="input-field" />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Clinic Name *" error={formErrors.clinicName}>
                    <input name="clinicName" value={form.clinicName} onChange={handleChange} placeholder="Clinic name" className="input-field" />
                  </FormField>
                  <FormField label="Location *" error={formErrors.location}>
                    <input name="location" value={form.location} onChange={handleChange} placeholder="City" className="input-field" />
                  </FormField>
                </div>

                <FormField label="Address *" error={formErrors.address}>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="Street address" className="input-field" />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Phone">
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="input-field" />
                  </FormField>
                  <FormField label="Email">
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@clinic.com" className="input-field" />
                  </FormField>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <FormField label="Consultation Fee (₹)">
                    <input name="consultationFee" type="number" min="0" value={form.consultationFee} onChange={handleChange} className="input-field" />
                  </FormField>
                  <FormField label="Rating (0–5)">
                    <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} className="input-field" />
                  </FormField>
                  <FormField label="Photo URL">
                    <input name="photo" value={form.photo} onChange={handleChange} placeholder="https://..." className="input-field" />
                  </FormField>
                </div>

                {/* Available days */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          form.availableDays.includes(day)
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {saving
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      : editDentist ? '✓ Update Dentist' : '+ Add Dentist'
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative card p-6 w-full max-w-sm text-center animate-scale-in">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-charcoal mb-2">Remove Dentist?</h3>
            <p className="text-slate-500 text-sm mb-5">This will deactivate the dentist profile.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete}
                className="btn-danger flex-1 flex items-center justify-center gap-1"
              >
                {deleting === confirmDelete
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Removing...</>
                  : 'Remove'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FormField = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default AdminDentists;
