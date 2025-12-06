import io

import torch
from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

# Load model (no login needed for public models)
MODEL_ID = "shawnmichael/vit-fire-smoke-detection-v4"
processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = AutoModelForImageClassification.from_pretrained(MODEL_ID)
model.eval()

app = FastAPI()

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    img_bytes = await file.read()
    if not img_bytes:
        raise HTTPException(status_code=400, detail="Empty file")

    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=-1)[0]

    predicted_id = int(torch.argmax(probs))
    label = model.config.id2label[predicted_id]
    score = float(probs[predicted_id])

    return {
        "label": label,      # e.g. "fire", "smoke", "normal"
        "score": score       # confidence 0–1
    }
