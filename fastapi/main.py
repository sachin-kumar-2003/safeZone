from fastapi import FastAPI, UploadFile, File  
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import shutil
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

model = YOLO("yolov8n.pt")


@app.get("/")
def home():
    return {"message": "AI Danger Detection API is running "}

@app.post("/detect")
async def detect(file : UploadFile = File(...)):
    try:
        print("image is detecting....")
        temp_file = Path(f"temp_{file.filename}")
        with open(temp_file , "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        results = model.predict(source=str(temp_file))
        detections = []
        for result in results:
            for box in result.boxes:
                cls_id = int(box.cls[0])   
                label = model.names[cls_id]  
                conf = float(box.conf[0])   
                detections.append({"label": label, "confidence": round(conf, 2)})
        return JSONResponse(content={"detections": detections})
    except:
        return JSONResponse(content={"Error":"something is wrong while calling api"})