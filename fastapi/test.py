from ultralytics import YOLO

model = YOLO("./models/firedetect-11x.pt")
results = model.predict(source="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkBmklVitvDQOewmTfLGJicvQOIDAVlewCrQ&s", save=True, conf=0.5)

print(results)