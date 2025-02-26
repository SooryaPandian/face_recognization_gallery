from flask import request, jsonify, send_from_directory
import os
from db import db
from config import Config
from face_utils import process_image
from werkzeug.utils import secure_filename
# Queue to handle image processing
import threading
import queue
image_queue = queue.Queue()

def process_images_from_queue():
    """Thread function to process images asynchronously"""
    while True:
        filepath = image_queue.get()
        if filepath is None:
            break  # Stop thread when None is received
        process_image(filepath)
        image_queue.task_done()

# Start a worker thread
worker_thread = threading.Thread(target=process_images_from_queue, daemon=True)
worker_thread.start()
def init_routes(app):
    @app.route('/delete_image/<filename>', methods=['DELETE'])
    def delete_image(filename):
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            os.remove(filepath)
            db.faces.delete_many({"images": {"$in": [filename]}})  # Remove face data related to the image
            return jsonify({"message": "Image deleted successfully"}), 200
        return jsonify({"error": "Image not found"}), 404

    @app.route('/delete_face/<face_id>', methods=['DELETE'])
    def delete_face(face_id):
        result = db.faces.delete_one({"face_id": face_id})
        if result.deleted_count > 0:
            return jsonify({"message": "Face deleted successfully"}), 200
        return jsonify({"error": "Face not found"}), 404

    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to the Face Recognition API"})

    @app.route('/gallery')
    def gallery():
        images = os.listdir(Config.UPLOAD_FOLDER)
        return jsonify({"images": images})

    @app.route('/update_face_name', methods=['POST'])
    def update_face_name():
        data = request.json
        face_id = data.get("face_id")
        new_name = data.get("new_name")

        if not face_id or not new_name:
            return jsonify({"error": "Invalid request"}), 400

        db.faces.update_one({"face_id": face_id}, {"$set": {"name": new_name}})
        return jsonify({"message": "Face name updated successfully"})

    @app.route('/faces')
    def faces():
        face_data = list(db.faces.find({}, {"_id": 0, "embeddings": 0}))  # Excluding embeddings
        return jsonify({"faces": face_data})

    @app.route('/search_face/<query>')
    def search_face(query):
        matched_faces = list(db.faces.find(
            {"face_id": {"$regex": query, "$options": "i"}},
            {"_id": 0, "embeddings": 0}  # Excluding embeddings
        ))
        return jsonify({"results": matched_faces})

    @app.route('/upload', methods=['POST'])
    def upload_files():
        if 'files' not in request.files:
            return jsonify({'error': 'No files uploaded'}), 400

        files = request.files.getlist('files')
        uploaded_files = []

        for file in files:
            if file.filename == '' or file.filename.split('.')[-1].lower() not in Config.ALLOWED_EXTENSIONS:
                continue  # Skip invalid files

            filename = secure_filename(file.filename)
            filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
            file.save(filepath)
            uploaded_files.append(filename)

            # Add to queue for processing
            image_queue.put(filepath)

        return jsonify({'message': 'Files uploaded and queued for processing', 'files': uploaded_files})

    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(Config.UPLOAD_FOLDER, filename)
