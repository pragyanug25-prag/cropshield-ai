

from data.diseases import DISEASE_DATABASE

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import shutil
import os
import requests
import base64

# Create FastAPI app
app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads folder
os.makedirs("uploads", exist_ok=True)

# Roboflow API details
API_KEY = "NtE3nyw9qwBkaKu0S9V5"

MODEL_URL = "https://serverless.roboflow.com/cropshield-ai-k7pfz/1"


@app.get("/")
def home():

    return {
        "message":
            "CropShield AI Backend Running"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Save uploaded image
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Convert image to base64
    with open(file_path, "rb") as image_file:

        encoded_string = base64.b64encode(
            image_file.read()
        ).decode("utf-8")

    # Send image to Roboflow
    response = requests.post(

        MODEL_URL,

        params={
            "api_key": API_KEY
        },

        data=encoded_string,

        headers={
            "Content-Type":
                "application/x-www-form-urlencoded"
        }
    )

    # Convert response to JSON
    prediction = response.json()

    print(prediction)

    # Check if prediction exists
    if (
        "predictions" not in prediction
        or len(prediction["predictions"]) == 0
    ):

        return {

            "disease": "Unknown",

            "confidence": 0,

            "severity": "Unknown",

            "description":
                "No disease detected.",

            "treatment": [],

            "prevention": [],

            "organicTreatment": []
        }

    # Extract top prediction
    top = prediction["predictions"][0]

    # Raw disease name
    raw_name = top["class"]

    # Database lookup key
    disease_key = raw_name

    # Clean display name
    disease_name = (
        raw_name
        .replace("___", " - ")
        .replace("__", " ")
        .replace("_", " ")
        .strip()
    )

    # Get disease info
    disease_info = DISEASE_DATABASE.get(

        disease_key,

        {
            "severity": "Unknown",

            "description":
                "No detailed information available.",

            "treatment": [
                "Consult agricultural expert"
            ],

            "prevention": [
                "Monitor plant health"
            ],

            "organicTreatment": [
                "Neem oil spray"
            ]
        }
    )

    # Final response
    return {

        "disease": disease_name,

        "confidence":
            round(top["confidence"] * 100, 2),

        "severity":
            disease_info["severity"],

        "description":
            disease_info["description"],

        "treatment":
            disease_info["treatment"],

        "prevention":
            disease_info["prevention"],

        "organicTreatment":
            disease_info["organicTreatment"]
    }

