import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'forge_data';

function getStorage() {
  if (typeof window !== 'undefined' && window.storage) return window.storage;
  return localStorage;
}

function loadData() {
  try {
    const raw = getStorage().getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveData(data) {
  try {
    getStorage().setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

export function useStorage() {
  const [data, setData] = useState(() => loadData());

  const set = useCallback((key, value) => {
    setData(prev => {
      const next = { ...prev, [key]: value };
      saveData(next);
      return next;
    });
  }, []);

  const setNested = useCallback((namespace, key, value) => {
    setData(prev => {
      const next = {
        ...prev,
        [namespace]: { ...(prev[namespace] || {}), [key]: value },
      };
      saveData(next);
      return next;
    });
  }, []);

  const get = useCallback((key, fallback = undefined) => {
    return data[key] !== undefined ? data[key] : fallback;
  }, [data]);

  const getNested = useCallback((namespace, key, fallback = '') => {
    return data[namespace]?.[key] !== undefined ? data[namespace][key] : fallback;
  }, [data]);

  return { data, set, setNested, get, getNested };
}
