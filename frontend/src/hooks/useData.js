import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

export const useDentists = (params = {}) => {
  const [dentists, setDentists] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params);

  const fetchDentists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDentists(params);
      setDentists(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    fetchDentists();
  }, [fetchDentists]);

  return { dentists, pagination, loading, error, refetch: fetchDentists };
};

export const useAppointments = (params = {}) => {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAppointments(params);
      setAppointments(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, pagination, loading, error, refetch: fetchAppointments };
};

export const useAppointmentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAppointmentStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
};
