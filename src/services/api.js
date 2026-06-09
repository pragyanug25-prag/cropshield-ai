import axios from 'axios'
//import { getRandomDisease } from '../data/mockData'

// ─── Axios instance ───────────────────────────────────────────────────────────
// In production, baseURL would point to your real ML backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.cropshield.ai',
  timeout: 30000,
})

// ─── Simulate network latency ─────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * analyzeImage
 * Accepts a File object, simulates uploading it to an AI backend,
 * and returns a structured disease diagnosis result.
 *
 * @param {File} imageFile - The plant image to analyse
 * @returns {Promise<Object>} - Disease diagnosis object
 */
export async function analyzeImage(imageFile) {

  const formData = new FormData()

  formData.append('file', imageFile)

  try {

    //const { data } = await axios.post(
      //'http://10.165.39.49:8000/predict',
    const { data } = await axios.post(
  'http://127.0.0.1:8000/predict',
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
)
    

   /* return {
      ...data,
      analysedAt: new Date().toISOString(),
      imageSize: `${(imageFile.size / 1024).toFixed(1)} KB`,
    }*/
   return {
  name: data.disease,
  description:
    "Early Blight is a common fungal disease affecting potato and tomato plants. Early detection helps reduce crop damage and yield loss.",

  scientificName: "Alternaria solani",
  icon: "🌿",

  confidence: data.confidence,
  severity: data.severity?.toLowerCase(),

  symptoms: data.symptoms || [],
  treatment: data.treatment || [],
  prevention: data.prevention || [],

  organic_treatment: data.organic_treatment || [
    "Spray neem oil every 7 days",
    "use compost tea as a foliar spray",
    "Apply garlic-chili extract weekly",
    "emove infected leaves promptly",
  ],

  products: [
    {
      name: "Neem Oil Spray",
      type: "Organic",
      dosage: "5 ml/L water",
    },
    {
      name: "Copper Fungicide",
      type: "Protective",
      dosage: "2 g/L water",
    },
  ],

  analysedAt: new Date().toISOString(),
  imageSize: `${(imageFile.size / 1024).toFixed(1)} KB`,
}

  } catch (error) {

    console.error('Backend Error:', error)

    throw error
  }
}

export default api
