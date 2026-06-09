"""
services/prediction_service.py

Orchestrates the full prediction pipeline:
  1. Preprocess raw image bytes
  2. Run model inference
  3. Build structured PredictionResult
"""

from __future__ import annotations

import logging
from typing import Any

import numpy as np

from model import DISEASE_CLASSES, get_disease_metadata, softmax_to_confidence
from preprocess import preprocess_image
from services.model_service import ModelService

logger = logging.getLogger(__name__)


class PredictionResult:
    """Value object returned from predict_disease()."""

    def __init__(
        self,
        disease: str,
        confidence: int,
        severity: str,
        symptoms: list[str],
        treatment: list[str],
        prevention: list[str],
        class_index: int,
        all_probabilities: dict[str, float],
    ):
        self.disease = disease
        self.confidence = confidence
        self.severity = severity
        self.symptoms = symptoms
        self.treatment = treatment
        self.prevention = prevention
        self.class_index = class_index
        self.all_probabilities = all_probabilities

    def to_dict(self) -> dict[str, Any]:
        return {
            "disease": self.disease,
            "confidence": self.confidence,
            "severity": self.severity,
            "symptoms": self.symptoms,
            "treatment": self.treatment,
            "prevention": self.prevention,
            "all_probabilities": self.all_probabilities,
        }


def predict_disease(image_bytes: bytes, filename: str = "image.jpg") -> PredictionResult:
    """
    End-to-end disease prediction from raw image bytes.

    Parameters
    ----------
    image_bytes: Raw bytes of the uploaded image file.
    filename:    Original filename for extension validation.

    Returns
    -------
    PredictionResult with disease label, confidence score, and care advice.

    Raises
    ------
    preprocess.ImageValidationError  — Invalid / unsupported image.
    RuntimeError                     — Model not loaded.
    """
    logger.info(f"Starting prediction for '{filename}' ({len(image_bytes)} bytes)")

    # Step 1 — Preprocess
    tensor = preprocess_image(image_bytes, filename)

    # Step 2 — Inference
    probabilities: np.ndarray = ModelService.predict(tensor)

    # Step 3 — Decode top prediction
    class_index: int = int(np.argmax(probabilities))
    confidence: int = softmax_to_confidence(probabilities, class_index)
    metadata = get_disease_metadata(class_index)

    # Build human-readable probability map
    all_probs = {
        DISEASE_CLASSES[i]["disease"]: round(float(probabilities[i]) * 100, 2)
        for i in range(len(probabilities))
        if i in DISEASE_CLASSES
    }

    result = PredictionResult(
        disease=metadata["disease"],
        confidence=confidence,
        severity=metadata["severity"],
        symptoms=metadata["symptoms"],
        treatment=metadata["treatment"],
        prevention=metadata["prevention"],
        class_index=class_index,
        all_probabilities=all_probs,
    )

    logger.info(
        f"Prediction complete: '{result.disease}' "
        f"(confidence={result.confidence}%, severity={result.severity})"
    )
    return result
