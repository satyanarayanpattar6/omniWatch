import { useState, useEffect } from 'react';

/**
 * Custom hook to safely fetch and stream data from our memory monitor endpoint.
 */
export function useInventoryStream() {
  const [data, setData] = useState({ lastUpdated: null, products: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLatestSnapshot() {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        
        const response = await fetch(`${BACKEND_URL}/api/inventory-monitor`);
        if (!response.ok) {
          throw new Error(`Server returned unhealthy status: ${response.status}`);
        }
        
        const snapshot = await response.json();
        setData(snapshot);
        setError(null);
      } catch (err) {
        console.error("[Hook Network Exception]", err);
        setError(err instanceof Error ? err.message : "Operational stream failure.");
      } finally {
        setLoading(false);
      }
    }

    // Fetch immediately on component mount
    fetchLatestSnapshot();
  }, []);

  return { data, loading, error };
}