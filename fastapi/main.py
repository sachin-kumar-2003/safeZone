from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import shutil
import requests
from pathlib import Path
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("./models/firedetect-11x.pt")


    

@app.get("/")
def home():
    return {"message": "AI Danger Detection API is running"}


@app.post("/detect")
async def detect(file:UploadFile=File(...)):
    try:
        temp_file = Path(f"temp_{file.filename}")
        with temp_file.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        results = model.predict(source=str(temp_file), save=True, conf=0.5)

        detections = []
        for r in results:
            for box in r.boxes:
                detections.append({
                    "class": model.names[int(box.cls)],
                    "confidence": float(box.conf),
                    "bbox": box.xyxy.tolist()[0]
                })

        temp_file.unlink(missing_ok=True)

        return JSONResponse(content={"detections": detections})

    except Exception as e:
        return JSONResponse(content={"error": f"Something went wrong: {str(e)}"}, status_code=500)