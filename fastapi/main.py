from fastapi import FastAPI, UploadFile, File   
from ultralytics import YOLO
import os                                      
          
app = FastAPI()

model = YOLO("yolov8n.pt")



@app.get("/")
def home():
    return {"message": "AI Danger Detection API is running "}

@app.post("/detect")
def detect():
    return {
        "message":"image is under detection process"
    }