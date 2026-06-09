# 🌿 CropShield AI — Backend

FastAPI + TensorFlow backend for plant disease detection.  
Accepts a leaf image upload, runs inference with a trained Keras model, and returns structured disease information.

---

## 📁 Project Structure

```
backend/
├── main.py                        # FastAPI app factory + middleware
├── model.py                       # Disease class definitions & metadata
├── preprocess.py                  # Image validation & preprocessing pipeline
├── requirements.txt
│
├── routers/
│   ├── __init__.py
│   ├── health.py                  # GET /health
│   └── predict.py                 # POST /predict
│
├── services/
│   ├── __init__.py
│   ├── model_service.py           # Keras model singleton (load / predict / unload)
│   └── prediction_service.py     # End-to-end pipeline orchestration
│
├── utils/
│   ├── __init__.py
│   ├── logger.py                  # Structured logging setup
│   └── validators.py              # MIME-type validation helper
│
├── models/
│   ├── README.md                  # Model placement instructions
│   └── plant_disease_model.h5     # ← Place your trained model here
│
├── frontend_integration/
│   ├── cropshield_api.js          # Axios API client (replaces mock)
│   └── useDiseasePredict.js       # React hook wrapper
│
└── README.md
```

---

## ⚙️ Requirements

| Requirement | Version |
|-------------|---------|
| Python      | 3.11    |
| TensorFlow  | 2.17    |
| FastAPI     | 0.115   |
| Uvicorn     | 0.32    |

---

## 🚀 Installation & Setup

### 1. Clone / navigate to the backend directory

```bash
cd backend
```

### 2. Create a virtual environment

```bash
python3.11 -m venv venv
source venv/bin/activate          # macOS / Linux
# venv\Scripts\activate           # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

> **TensorFlow note:** The first install will download ~500 MB.  
> On Apple Silicon, use `pip install tensorflow-macos tensorflow-metal` instead.

### 4. Place your trained model

```
backend/models/plant_disease_model.h5
```

The model must:
- Accept input `(None, 224, 224, 3)` — float32, values in `[0.0, 1.0]`
- Output `(None, 5)` — softmax probabilities in this class order:
  - `0` → Healthy
  - `1` → Early Blight
  - `2` → Late Blight
  - `3` → Leaf Spot
  - `4` → Powdery Mildew

### 5. Run the development server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Run in production

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 🌐 API Endpoints

### `GET /`
API root — returns name, version, and available endpoint paths.

### `GET /health`
Liveness + readiness probe.

**Response (model loaded):**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "/app/models/plant_disease_model.h5",
  "uptime_seconds": 42.3,
  "timestamp": "2025-01-15T10:30:00+00:00",
  "python_version": "3.11.9",
  "platform": "Linux"
}
```

### `POST /predict`
Upload a leaf image and receive a disease diagnosis.

| Parameter | Type              | Description                        |
|-----------|-------------------|------------------------------------|
| `file`    | multipart/form-data | Leaf image (JPG, PNG, WebP, BMP) |

**Response:**
```json
{
  "disease": "Late Blight",
  "confidence": 94,
  "severity": "High",
  "symptoms": [
    "Water-soaked, pale green to brown irregular lesions on leaves",
    "White-grey sporulation on leaf undersides in humid conditions",
    "Rapid browning and collapse of leaf tissue"
  ],
  "treatment": [
    "Apply systemic fungicide (mefenoxam or metalaxyl) immediately",
    "Follow up with protectant fungicides (chlorothalonil, mancozeb)"
  ],
  "prevention": [
    "Plant resistant varieties",
    "Avoid overhead irrigation; use drip systems"
  ],
  "all_probabilities": {
    "Healthy": 0.5,
    "Early Blight": 2.1,
    "Late Blight": 94.0,
    "Leaf Spot": 1.8,
    "Powdery Mildew": 1.6
  }
}
```

---

## 🧪 Sample cURL Requests

### Health check
```bash
curl http://localhost:8000/health
```

### Disease prediction
```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@/path/to/leaf_image.jpg"
```

### Using HTTPie
```bash
http POST localhost:8000/predict file@leaf.jpg
```

---

## 🔌 Frontend Integration

### 1. Add the API client

Copy `frontend_integration/cropshield_api.js` to your React `src/api/` folder.

### 2. Add environment variable

In your Vite project root, create or update `.env`:

```
VITE_API_URL=http://localhost:8000
```

### 3. Replace the mock

**Before:**
```js
import { getRandomDisease } from './mockData';
const result = getRandomDisease();
setDiagnosis(result);
```

**After:**
```js
import { predictDisease, getErrorMessage } from './api/cropshield_api';

const handleUpload = async (file) => {
  try {
    setLoading(true);
    const result = await predictDisease(file);
    setDiagnosis(result);
  } catch (err) {
    setError(getErrorMessage(err));
  } finally {
    setLoading(false);
  }
};
```

Or use the ready-made React hook:

```js
import { useDiseasePredict } from './hooks/useDiseasePredict';

function UploadForm() {
  const { predict, result, loading, error } = useDiseasePredict();

  return (
    <>
      <input type="file" accept="image/*" onChange={e => predict(e.target.files[0])} />
      {loading && <p>Analysing leaf…</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}
      {result  && <DiagnosisCard data={result} />}
    </>
  );
}
```

---

## 🐳 Docker (optional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

```bash
docker build -t cropshield-ai .
docker run -p 8000:8000 -v $(pwd)/models:/app/models cropshield-ai
```

---

## 📋 HTTP Status Codes

| Code | Meaning                                                  |
|------|----------------------------------------------------------|
| 200  | Successful prediction                                    |
| 400  | Bad request (empty file, read error)                     |
| 415  | Unsupported media type (not an image)                    |
| 422  | Validation error (invalid image, too small, too large)   |
| 500  | Internal server error                                    |
| 503  | Model not loaded / unavailable                           |

---

## 🌾 Disease Classes (PlantVillage)

| Index | Class         | Severity |
|-------|---------------|----------|
| 0     | Healthy       | None     |
| 1     | Early Blight  | Moderate |
| 2     | Late Blight   | High     |
| 3     | Leaf Spot     | Moderate |
| 4     | Powdery Mildew| Low      |

---

## 🔍 Interactive API Docs

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:**       http://localhost:8000/redoc
