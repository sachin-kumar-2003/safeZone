import requests

API_URL = "https://api-inference.huggingface.co/models/Gurveer05/vit-base-patch16-224-in21k-fire-detection"
headers = {"Authorization": "Bearer sachin"}

def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

output = query("/fastapi/temp_frame.jpg")
print(output)