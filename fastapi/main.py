import io
import asyncio
import torch
from fastapi import FastAPI, File, UploadFile, HTTPException
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification


MODEL_ID = "shawnmichael/vit-fire-smoke-detection-v4"
CONFIDENCE_THRESHOLD = 0.80

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = AutoModelForImageClassification.from_pretrained(MODEL_ID)
model.to(device)
model.eval()

app = FastAPI(title="Fire Detection API (Local)")


def run_local_inference(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=-1)[0]

    results = []
    for idx, score in enumerate(probs):
        label = model.config.id2label[idx]
        results.append({
            "class": label,
            "confidence": round(score.item(), 4)
        })

    results.sort(key=lambda x: x["confidence"], reverse=True)
    return results


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    try:
        predictions = await asyncio.to_thread(run_local_inference, image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    detections = []

    top = predictions[0]
    if top["class"].lower() in ["fire", "smoke"] and top["confidence"] >= CONFIDENCE_THRESHOLD:
        detections.append(top)

    return {
        "detections": detections
    }
