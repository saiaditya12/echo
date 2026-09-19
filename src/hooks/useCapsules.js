import { useState, useEffect, useCallback } from 'react';
import { initDB, getCapsules, createCapsule as dbCreateCapsule, deleteCapsule as dbDeleteCapsule } from '../lib/db';

export function useCapsules() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshCapsules = useCallback(() => {
    try {
      const data = getCapsules();
      setCapsules(data);
      setError(null);
    } catch (err) {
      console.error('[useCapsules] Failed to fetch capsules:', err);
      setError(err.message || 'Failed to fetch capsules');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        setLoading(true);
        await initDB();
        if (mounted) {
          const initialData = getCapsules();
          setCapsules(initialData);
          setLoading(false);
        }
      } catch (err) {
        console.error('[useCapsules] Initialization failed:', err);
        if (mounted) {
          setError(err.message || 'Failed to initialize database');
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const addCapsule = useCallback(async ({ title, message, unlock_date }) => {
    try {
      setError(null);
      const newCapsule = await dbCreateCapsule({ title, message, unlock_date });
      setCapsules((prev) => {
        const next = [...prev, newCapsule];
        return next.sort((a, b) => new Date(a.unlock_date) - new Date(b.unlock_date));
      });
      return newCapsule;
    } catch (err) {
      console.error('[useCapsules] Failed to create capsule:', err);
      setError(err.message || 'Failed to create capsule');
      throw err;
    }
  }, []);

  const removeCapsule = useCallback(async (id) => {
    try {
      setError(null);
      await dbDeleteCapsule(id);
      setCapsules((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      console.error('[useCapsules] Failed to delete capsule:', err);
      setError(err.message || 'Failed to delete capsule');
      throw err;
    }
  }, []);

  return {
    capsules,
    loading,
    error,
    addCapsule,
    removeCapsule,
    refreshCapsules,
  };
}
