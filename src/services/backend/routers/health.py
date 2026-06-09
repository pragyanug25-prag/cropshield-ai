"""
routers/health.py

GET /health — Liveness + readiness probe for the API.
"""

from __future__ import annotations

import logging
import platform
import sys
from datetime import datetime, timezone

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from services.model_service import ModelService

logger = logging.getLogger(__name__)

router = APIRouter()

# Record startup time
_STARTUP_TIME = datetime.now(timezone.utc)


@router.get(
    "/health",
    summary="Health and readiness check",
    response_description="Service health status",
)
async def health_check():
    """
    Returns the operational status of the API and its ML model.

    - `status`: `"healthy"` when the model is loaded and ready; `"degraded"` otherwise.
    - `model_loaded`: Whether the Keras model is in memory.
    - `uptime_seconds`: Seconds since the server started.
    """
    model_loaded = ModelService.is_loaded()
    status = "healthy" if model_loaded else "degraded"
    uptime = (datetime.now(timezone.utc) - _STARTUP_TIME).total_seconds()

    http_status = 200 if model_loaded else 503

    payload = {
        "status": status,
        "model_loaded": model_loaded,
        "model_path": ModelService.model_path(),
        "uptime_seconds": round(uptime, 1),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "python_version": sys.version.split()[0],
        "platform": platform.system(),
    }

    logger.debug(f"Health check → {status}")
    return JSONResponse(content=payload, status_code=http_status)
