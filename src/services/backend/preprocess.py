"""
preprocess.py — Image preprocessing pipeline for CropShield AI.

Handles:
  - Reading raw bytes → PIL Image
  - Validating file type and dimensions
  - Resizing to model input size (224 × 224)
  - Normalising pixel values to [0, 1]
  - Expanding dims → (1, 224, 224, 3) NumPy array ready for inference
"""

from __future__ import annotations

import io
import logging
from typing import Tuple

import numpy as np
from PIL import Image, UnidentifiedImageError

logger = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────
TARGET_SIZE: Tuple[int, int] = (224, 224)          # (height, width)
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "bmp"}
MAX_FILE_SIZE_MB = 10
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

MIN_DIMENSION = 32    # px — reject tiny images that carry no useful information
MAX_DIMENSION = 8000  # px — reject absurdly large images


class ImageValidationError(ValueError):
    """Raised when an uploaded image fails validation checks."""


def validate_file_extension(filename: str) -> None:
    """Ensure the filename has an accepted image extension."""
    if not filename:
        raise ImageValidationError("No filename provided.")
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ImageValidationError(
            f"Unsupported file type '.{ext}'. "
            f"Accepted types: {', '.join(sorted(ALLOWED_EXTENSIONS))}."
        )


def validate_file_size(data: bytes) -> None:
    """Ensure the raw bytes do not exceed the maximum allowed size."""
    if len(data) > MAX_FILE_SIZE_BYTES:
        size_mb = len(data) / (1024 * 1024)
        raise ImageValidationError(
            f"File size {size_mb:.1f} MB exceeds the {MAX_FILE_SIZE_MB} MB limit."
        )


def validate_image_dimensions(image: Image.Image) -> None:
    """Ensure the image is within sensible dimension bounds."""
    w, h = image.size
    if w < MIN_DIMENSION or h < MIN_DIMENSION:
        raise ImageValidationError(
            f"Image too small ({w}×{h} px). Minimum: {MIN_DIMENSION}×{MIN_DIMENSION} px."
        )
    if w > MAX_DIMENSION or h > MAX_DIMENSION:
        raise ImageValidationError(
            f"Image too large ({w}×{h} px). Maximum: {MAX_DIMENSION}×{MAX_DIMENSION} px."
        )


def bytes_to_pil(data: bytes) -> Image.Image:
    """Decode raw bytes into a PIL Image, converting to RGB."""
    try:
        image = Image.open(io.BytesIO(data))
    except UnidentifiedImageError:
        raise ImageValidationError(
            "The uploaded file could not be decoded as an image. "
            "Please upload a valid JPG, PNG, or WebP file."
        )
    except Exception as exc:
        raise ImageValidationError(f"Failed to open image: {exc}")

    # Ensure 3-channel RGB (handles palette, RGBA, greyscale, etc.)
    if image.mode != "RGB":
        image = image.convert("RGB")
    return image


def resize_image(image: Image.Image) -> Image.Image:
    """Resize image to TARGET_SIZE using high-quality Lanczos resampling."""
    return image.resize(TARGET_SIZE, Image.LANCZOS)


def normalize_image(image: Image.Image) -> np.ndarray:
    """Convert PIL image to float32 NumPy array normalised to [0, 1]."""
    arr = np.array(image, dtype=np.float32)
    arr /= 255.0
    return arr


def preprocess_image(data: bytes, filename: str = "image.jpg") -> np.ndarray:
    """
    Full preprocessing pipeline.

    Parameters
    ----------
    data:     Raw image bytes (from the uploaded file).
    filename: Original filename — used for extension validation.

    Returns
    -------
    np.ndarray of shape (1, 224, 224, 3), dtype float32.

    Raises
    ------
    ImageValidationError: If any validation or processing step fails.
    """
    logger.debug(f"Preprocessing '{filename}' ({len(data)} bytes) …")

    validate_file_extension(filename)
    validate_file_size(data)

    pil_image = bytes_to_pil(data)
    validate_image_dimensions(pil_image)

    pil_image = resize_image(pil_image)
    arr = normalize_image(pil_image)

    # Add batch dimension → (1, H, W, C)
    tensor = np.expand_dims(arr, axis=0)

    logger.debug(f"Preprocessed tensor shape: {tensor.shape}, dtype: {tensor.dtype}")
    return tensor
