"""
services/model_service.py

Singleton service that owns the TF/Keras model lifecycle:
  - load_model()    — called once at startup
  - predict()       — called per request
  - unload_model()  — called at shutdown
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Optional

import numpy as np

logger = logging.getLogger(__name__)

MODEL_PATH = Path(__file__).parent.parent / "models" / "plant_disease_model.h5"


class ModelService:
    _model: Optional[Any] = None   # keras.Model at runtime
    _model_loaded: bool = False

    # ── Lifecycle ─────────────────────────────────────────────────────────────

    @classmethod
    def load_model(cls) -> None:
        """Load the Keras model from disk into memory (called once at startup)."""
        if cls._model_loaded:
            logger.info("Model already loaded — skipping.")
            return

        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model file not found at '{MODEL_PATH}'. "
                "Please place your trained model at backend/models/plant_disease_model.h5"
            )

        # Import TF here to avoid slow top-level import if the service is not used
        import tensorflow as tf  # noqa: PLC0415

        logger.info(f"Loading model from '{MODEL_PATH}' …")
        cls._model = tf.keras.models.load_model(str(MODEL_PATH))
        cls._model_loaded = True

        # Log input/output shapes for visibility
        try:
            inp = cls._model.input_shape
            out = cls._model.output_shape
            logger.info(f"Model input shape: {inp} | output shape: {out}")
        except Exception:
            pass  # Non-critical

    @classmethod
    def unload_model(cls) -> None:
        """Release model from memory."""
        cls._model = None
        cls._model_loaded = False
        logger.info("Model unloaded.")

    # ── Inference ─────────────────────────────────────────────────────────────

    @classmethod
    def predict(cls, tensor: np.ndarray) -> np.ndarray:
        """
        Run inference on a preprocessed image tensor.

        Parameters
        ----------
        tensor: np.ndarray of shape (1, 224, 224, 3)

        Returns
        -------
        np.ndarray of shape (num_classes,) — softmax probabilities
        """
       # if not cls._model_loaded or cls._model is None:
           # raise RuntimeError(
              #  "Model is not loaded. "
               # "Ensure the server started correctly and the model file exists."
            #)

        #logger.debug(f"Running inference on tensor shape {tensor.shape}")
        #predictions = cls._model.predict(tensor, verbose=0)  # shape: (1, num_classes)
        # Demo prediction
        probabilities = np.array([
          0.05,  # Healthy
          0.82,  # Early Blight
          0.05,  # Late Blight
          0.04,  # Leaf Spot
          0.04   # Powdery Mildew
        ])
        return probabilities

    # ── Status ────────────────────────────────────────────────────────────────

    @classmethod
    def is_loaded(cls) -> bool:
        return cls._model_loaded

    @classmethod
    def model_path(cls) -> str:
        return str(MODEL_PATH)
