/**
 * hooks/useDiseasePredict.js
 *
 * React hook that wraps predictDisease() with loading / error state.
 *
 * Usage in any component:
 *
 *   const { predict, result, loading, error, reset } = useDiseasePredict();
 *
 *   <input type="file" onChange={e => predict(e.target.files[0])} />
 *   {loading && <Spinner />}
 *   {error   && <p className="error">{error}</p>}
 *   {result  && <DiagnosisCard data={result} />}
 */

import { useState, useCallback } from 'react';
import { predictDisease, getErrorMessage } from '../api/cropshield_api';

export function useDiseasePredict() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const predict = useCallback(async (imageFile) => {
    if (!imageFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictDisease(imageFile);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { predict, result, loading, error, reset };
}
