"""
model.py — TensorFlow/Keras model wrapper for CropShield AI.

Responsible for:
  - Loading the .h5 model from disk
  - Running inference on a preprocessed image tensor
  - Mapping class indices → disease metadata
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)

# ── Model path ────────────────────────────────────────────────────────────────
MODEL_PATH = Path(__file__).parent / "models" / "plant_disease_model.h5"

# ── PlantVillage class definitions ─────────────────────────────────────────────
# Each entry maps a class index (matching training order) to rich metadata.
DISEASE_CLASSES: dict[int, dict[str, Any]] = {
    0: {
        "disease": "Healthy",
        "severity": "None",
        "symptoms": [
            "No visible lesions or discolouration",
            "Firm, vibrant green leaves",
            "Normal growth pattern",
        ],
        "treatment": [
            "No treatment required",
            "Maintain current care routine",
        ],
        "prevention": [
            "Continue regular monitoring",
            "Ensure adequate nutrition and irrigation",
            "Rotate crops annually",
        ],
    },
    1: {
        "disease": "Early Blight",
        "severity": "Moderate",
        "symptoms": [
            "Dark brown circular spots with concentric rings (target-board pattern)",
            "Yellow halo surrounding lesions",
            "Lesions typically appear on older/lower leaves first",
            "Premature leaf drop in severe cases",
        ],
        "treatment": [
            "Apply copper-based fungicide (e.g., Bordeaux mixture) every 7–10 days",
            "Remove and destroy infected leaves immediately",
            "Apply chlorothalonil or mancozeb as directed",
            "Avoid overhead irrigation to reduce leaf wetness",
        ],
        "prevention": [
            "Use certified disease-free or resistant seed varieties",
            "Maintain adequate spacing for airflow",
            "Practice crop rotation (minimum 3-year cycle)",
            "Apply organic mulch to reduce soil splash",
            "Scout fields regularly, especially during warm humid periods",
        ],
    },
    2: {
        "disease": "Late Blight",
        "severity": "High",
        "symptoms": [
            "Water-soaked, pale green to brown irregular lesions on leaves",
            "White-grey sporulation on leaf undersides in humid conditions",
            "Rapid browning and collapse of leaf tissue",
            "Dark brown lesions on stems and petioles",
            "Infected fruit shows firm, brown, greasy-looking rot",
        ],
        "treatment": [
            "Apply systemic fungicide (mefenoxam or metalaxyl) immediately",
            "Follow up with protectant fungicides (chlorothalonil, mancozeb)",
            "Remove and bag infected plant material — do not compost",
            "Increase plant spacing to improve airflow",
            "Drench soil if root/crown infection is suspected",
        ],
        "prevention": [
            "Plant resistant varieties (e.g., Defiant, Jasper for tomatoes)",
            "Avoid overhead irrigation; use drip systems",
            "Apply preventive fungicide sprays before disease onset",
            "Destroy volunteer plants and cull piles",
            "Monitor weather forecasts — high-risk conditions: cool nights + warm humid days",
        ],
    },
    3: {
        "disease": "Leaf Spot",
        "severity": "Moderate",
        "symptoms": [
            "Small, circular to irregular brown or black spots",
            "Spots may have yellow to tan centres with darker borders",
            "Premature defoliation in severe infections",
            "Spots may coalesce forming larger necrotic patches",
        ],
        "treatment": [
            "Apply copper hydroxide or copper oxychloride fungicide",
            "Use iprodione or azoxystrobin for severe infections",
            "Remove heavily infected leaves and dispose off-site",
            "Reduce irrigation frequency; water at the base of plants",
        ],
        "prevention": [
            "Select resistant or tolerant cultivars where available",
            "Avoid working in fields when foliage is wet",
            "Ensure balanced fertilisation — excess nitrogen increases susceptibility",
            "Clean and sanitise tools between plants",
            "Apply preventive fungicide at first sign of disease history",
        ],
    },
    4: {
        "disease": "Powdery Mildew",
        "severity": "Low",
        "symptoms": [
            "White to grey powdery fungal growth on upper leaf surfaces",
            "Affected leaves may yellow and curl",
            "Stunted shoot growth in young plants",
            "Severely infected leaves turn brown and drop",
        ],
        "treatment": [
            "Apply sulphur-based fungicide or potassium bicarbonate",
            "Use systemic fungicides (myclobutanil, tebuconazole) for severe cases",
            "Spray neem oil solution (2%) as an organic alternative",
            "Remove and destroy heavily infected tissue",
        ],
        "prevention": [
            "Plant resistant varieties",
            "Ensure good air circulation through proper spacing and pruning",
            "Avoid excessive nitrogen fertilisation",
            "Water in the morning so leaves dry before nightfall",
            "Apply preventive sulphur sprays in high-risk seasons",
        ],
    },
}

# ── Number of output classes the model was trained on ─────────────────────────
NUM_CLASSES = len(DISEASE_CLASSES)  # 5


def get_disease_metadata(class_index: int) -> dict[str, Any]:
    """Return metadata dict for a predicted class index.

    Falls back to a generic entry if the index is out of range (shouldn't
    happen in production, but keeps the API from crashing on edge cases).
    """
    if class_index in DISEASE_CLASSES:
        return DISEASE_CLASSES[class_index]

    logger.warning(f"Unknown class index {class_index}; returning fallback.")
    return {
        "disease": "Unknown",
        "severity": "Unknown",
        "symptoms": ["Unable to determine — please consult an agronomist."],
        "treatment": ["Consult a local plant pathologist."],
        "prevention": ["Regular scouting and crop monitoring recommended."],
    }


def softmax_to_confidence(probabilities: np.ndarray, class_index: int) -> int:
    """Convert a softmax probability array to a percentage confidence score."""
    raw = float(probabilities[class_index])
    return round(raw * 100)
