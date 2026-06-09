"""
routers/predict.py

POST /predict — Accept a leaf image and return a disease prediction.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, File, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from preprocess import ImageValidationError
from services.prediction_service import predict_disease
from utils.validators import validate_content_type

logger = logging.getLogger(__name__)

router = APIRouter()

ACCEPTED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/bmp",
}


@router.post(
    "/predict",
    summary="Predict plant disease from a leaf image",
    response_description="Disease prediction with confidence score and treatment advice",
    status_code=status.HTTP_200_OK,
)
async def predict(
    file: UploadFile = File(..., description="Leaf image (JPG / PNG / WebP, max 10 MB)"),
):
    """
    Upload a leaf image and receive an AI-powered plant disease diagnosis.

    - **file**: Multipart image upload (JPG, PNG, WebP, BMP — max 10 MB)

    Returns a JSON object with:
    - `disease`: Identified disease name
    - `confidence`: Prediction confidence (0–100 %)
    - `severity`: Risk level (None / Low / Moderate / High)
    - `symptoms`: List of observable symptoms
    - `treatment`: Recommended treatment steps
    - `prevention`: Preventive measures
    - `all_probabilities`: Softmax scores for all classes
    """

    # ── Content-type guard ────────────────────────────────────────────────────
    try:
        validate_content_type(file.content_type, ACCEPTED_CONTENT_TYPES)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail=str(exc))

    # ── Read bytes ────────────────────────────────────────────────────────────
    try:
        image_bytes = await file.read()
    except Exception as exc:
        logger.error(f"Failed to read uploaded file: {exc}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read the uploaded file. Please try again.",
        )
    finally:
        await file.close()

    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    filename = file.filename or "image.jpg"

    # ── Predict ───────────────────────────────────────────────────────────────
    try:
        result = predict_disease(image_bytes, filename)
    except ImageValidationError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    except RuntimeError as exc:
        logger.error(f"Model inference error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The prediction model is currently unavailable. Please try again later.",
        )
    except Exception as exc:
        logger.error(f"Unexpected prediction error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during prediction.",
        )

    return JSONResponse(content=result.to_dict())
