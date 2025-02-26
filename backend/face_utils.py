import cv2
import mediapipe as mp
import numpy as np
import torch
from torchvision import transforms
from facenet_pytorch import InceptionResnetV1
from scipy.spatial.distance import cosine
from db import db
import os
# Initialize Face Detection
mp_face_detection = mp.solutions.face_detection

# Initialize FaceNet model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = InceptionResnetV1(pretrained='vggface2').eval().to(device)
transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((160, 160)),
    transforms.ToTensor()
])

def extract_embedding(image):
    """Extracts face embedding using FaceNet."""
    try:
        img_tensor = transform(image).unsqueeze(0).to(device)
        with torch.no_grad():
            embedding = model(img_tensor).cpu().numpy().flatten()
        return embedding
    except:
        return None

def find_closest_match(new_embedding, threshold=0.4):
    """Finds the closest matching face using cosine similarity."""
    best_match = None
    min_distance = float("inf")
    for face in db.faces.find():
        for emb in face['embeddings']:
            distance = cosine(new_embedding, np.array(emb))
            if distance < min_distance:
                min_distance = distance
                best_match = face['face_id']
    return best_match if min_distance < threshold else None

def process_image(image_path):
    """Detects faces, extracts embeddings, and updates the database."""
    image = cv2.imread(image_path)
    if image is None:
        return None
    filename = os.path.basename(image_path)
    print("LOG: =----- -- --- - -- ",image_path,filename)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    with mp_face_detection.FaceDetection(min_detection_confidence=0.5) as face_detection:
        results = face_detection.process(image_rgb)

        if results.detections:
            detected_faces = []
            for i, detection in enumerate(results.detections):
                bboxC = detection.location_data.relative_bounding_box
                h, w, _ = image.shape
                x, y, width, height = (
                    int(bboxC.xmin * w), int(bboxC.ymin * h), 
                    int(bboxC.width * w), int(bboxC.height * h)
                )
                face_crop = image[y:y+height, x:x+width]
                if face_crop.size == 0:
                    continue
                
                embedding = extract_embedding(face_crop)
                if embedding is not None:
                    face_id = find_closest_match(embedding)
                    if not face_id:
                        face_id = f"face_{db.faces.count_documents({}) + 1}"
                        db.faces.insert_one({
                            "face_id": face_id,
                            "embeddings": [embedding.tolist()],
                            "images": [filename]
                        })
                    else:
                        db.faces.update_one({"face_id": face_id}, {'$push': {"embeddings": embedding.tolist(), "images": filename}})
                    
                 
                    detected_faces.append({"face_id": face_id, "bbox": (x, y, width, height)})
            return detected_faces
    return None
