from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import shutil
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
fire_model = YOLO("./models/firedetect-11x.pt")
accident_model = YOLO("./models/epoch14.pt")


@app.get("/")
def home():
    return {"message": "AI Danger Detection API is running"}


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    try:
        temp_file = Path(f"temp_{file.filename}")
        with temp_file.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        detections = []

        fire_results = fire_model(temp_file, conf=0.5)
        for box in fire_results[0].boxes:
            detections.append({
                "model": "fire_smoke",
                "class": fire_results[0].names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy.tolist()[0]
            })

        accident_results = accident_model(temp_file, conf=0.5)
        for box in accident_results[0].boxes:
            detections.append({
                "model": "accident",
                "class": accident_results[0].names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy.tolist()[0]
            })

        temp_file.unlink(missing_ok=True)

        return JSONResponse(content={"detections": detections})

    except Exception as e:
        return JSONResponse(content={"error": f"Something went wrong: {str(e)}"}, status_code=500)
