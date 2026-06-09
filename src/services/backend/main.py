"""
CropShield AI - FastAPI Backend
Plant Disease Detection System
"""

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers import predict, health
from services.model_service import ModelService
from utils.logger import setup_logger

# ── Logging ─────────────────────────────────────────────────────────────────
logger = setup_logger(__name__)


# ── Lifespan (startup / shutdown) ────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the ML model on startup; release resources on shutdown."""
    logger.info("🌱 CropShield AI backend starting up …")
    try:
        ModelService.load_model()
        logger.info("✅ Model loaded successfully")
    except Exception as exc:
        logger.error(f"❌ Failed to load model: {exc}")
        # Allow startup to continue so /health reflects the failed state
    yield
    logger.info("🛑 CropShield AI backend shutting down …")
    ModelService.unload_model()


# ── App factory ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="CropShield AI",
    description="Plant disease detection API powered by deep learning.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        # Add your production domain here, e.g. "https://cropshield.ai"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request timing middleware ─────────────────────────────────────────────────
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    response.headers["X-Process-Time"] = f"{(time.time() - start) * 1000:.2f}ms"
    return response


# ── Global exception handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again."},
    )


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router, tags=["Health"])
app.include_router(predict.router, tags=["Prediction"])


# ── Root endpoint ─────────────────────────────────────────────────────────────
@app.get("/", summary="API root")
async def root():
    return {
        "name": "CropShield AI API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
        "predict": "/predict",
    }
