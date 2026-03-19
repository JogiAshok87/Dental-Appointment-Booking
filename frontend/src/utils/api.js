const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const message =
      data.message ||
      (data.errors && data.errors.map((e) => e.msg).join(', ')) ||
      'Something went wrong';
    throw new Error(message);
  }
  return data;
};

export const api = {
  // Dentists
  getDentists: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/dentists${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  getDentist: (id) =>
    fetch(`${BASE_URL}/dentists/${id}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  getLocations: () =>
    fetch(`${BASE_URL}/dentists/meta/locations`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  addDentist: (data) =>
    fetch(`${BASE_URL}/dentists`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateDentist: (id, data) =>
    fetch(`${BASE_URL}/dentists/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteDentist: (id) =>
    fetch(`${BASE_URL}/dentists/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Appointments
  getAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/appointments${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    }).then(handleResponse);
  },

  getAppointmentStats: () =>
    fetch(`${BASE_URL}/appointments/stats`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  createAppointment: (data) =>
    fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateAppointmentStatus: (id, status) =>
    fetch(`${BASE_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    }).then(handleResponse),

  deleteAppointment: (id) =>
    fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then(handleResponse),

  // Auth
  login: (credentials) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),
};
