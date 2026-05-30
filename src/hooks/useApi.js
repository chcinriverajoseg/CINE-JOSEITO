import { useState, useEffect } from 'react';

// En desarrollo usa localhost, en producción usa la variable de Vercel
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function useApi(endpoint) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}${endpoint}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => { if (!cancelled) { setData(json); setLoading(false); } })
      .catch(err => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [endpoint]);

  return { data, loading, error };
}

// También exportamos BASE_URL para usarlo en fetch manuales (auth, favoritos)
export { BASE_URL };
export default BASE_URL;
