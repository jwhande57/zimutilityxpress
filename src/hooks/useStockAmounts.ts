import { useState, useEffect } from 'react';
import { fetchStockAmounts } from '../services/stockApi'

export function useStockAmounts(productId: number) {
  const [amounts, setAmounts] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchStockAmounts(productId)
      .then(amts => {
        if (!cancelled) setAmounts(amts);
      })
      .catch(err => {
        console.error(err);
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [productId]);

  return { amounts, loading, error };
}
