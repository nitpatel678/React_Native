from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import uvicorn

app = FastAPI()
model = YOLO("yolov8n.pt")

# Enable CORS for mobile app access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev: allow all, restrict in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    # Read image
    image_bytes = await file.read()
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Run inference
    results = model(image)

    # Prepare response
    detections = []
    for r in results:
        for box in r.boxes:
            detections.append({
                "label": model.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy[0].tolist(),  # [x1, y1, x2, y2]
            })
    return {"detections": detections}
