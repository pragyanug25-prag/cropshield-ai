/**
 * api/cropshield.js
 *
 * Drop-in replacement for the mock `getRandomDisease()` call.
 * Calls the CropShield AI FastAPI backend and returns a structured prediction.
 *
 * Usage (React component):
 *
 *   import { predictDisease } from './api/cropshield';
 *
 *   const handleUpload = async (file) => {
 *     try {
 *       setLoading(true);
 *       const result = await predictDisease(file);
 *       setDiagnosis(result);
 *     } catch (err) {
 *       setError(err.message);
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 */

import axios from 'axios';

// ── Config ────────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000, // 30 s — model inference can take a moment
});

// ── Types (JSDoc) ─────────────────────────────────────────────────────────────
/**
 * @typedef {Object} PredictionResult
 * @property {string}   disease            - Identified disease name
 * @property {number}   confidence         - Confidence score 0–100
 * @property {string}   severity           - "None" | "Low" | "Moderate" | "High"
 * @property {string[]} symptoms           - Observable symptoms
 * @property {string[]} treatment          - Recommended treatments
 * @property {string[]} prevention         - Preventive measures
 * @property {Object}   all_probabilities  - Per-class softmax scores
 */

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * Upload a leaf image and get a plant disease prediction.
 *
 * Replaces:  const result = getRandomDisease();
 * With:      const result = await predictDisease(file);
 *
 * @param {File} imageFile  - The File object from an <input type="file">
 * @returns {Promise<PredictionResult>}
 */
export async function predictDisease(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await apiClient.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

/**
 * Check if the backend is online and the model is loaded.
 *
 * @returns {Promise<{ status: string, model_loaded: boolean, uptime_seconds: number }>}
 */
export async function checkHealth() {
  const response = await apiClient.get('/health');
  return response.data;
}

// ── Error helper ──────────────────────────────────────────────────────────────

/**
 * Extract a human-readable error message from an Axios error.
 *
 * @param {import('axios').AxiosError} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (error.response) {
    // Server responded with a non-2xx status
    const detail = error.response.data?.detail;
    if (detail) return typeof detail === 'string' ? detail : JSON.stringify(detail);
    return `Server error ${error.response.status}`;
  }
  if (error.request) {
    return 'Could not reach the CropShield AI server. Is it running?';
  }
  return error.message || 'An unexpected error occurred.';
}
