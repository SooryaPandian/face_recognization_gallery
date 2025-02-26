# Face Recognition Gallery

This project is a full-stack application for face recognition and gallery management. It includes a React frontend and a Flask backend with MongoDB for data storage.

## Features

- Upload images and process them for face recognition
- View gallery of uploaded images
- Search for faces by ID
- Update face names
- Delete images and faces

## Project Structure

```
face_recognization_gallery/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── db.py
│   ├── face_utils.py
│   └── routes.py
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── ...other React components
│   ├── index.html
│   ├── package.json
│   └── README.md
└── README.md
```

## Backend

The backend is built with Flask and handles image processing, face recognition, and database operations.

### Setup

1. Create a virtual environment and activate it:

   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. Install the required packages:

   ```sh
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```sh
   python backend/app.py
   ```

### Configuration

The `config.py` file contains configuration settings such as the upload folder and MongoDB URI.

### Routes

- `GET /`: Welcome message
- `GET /gallery`: Get list of uploaded images
- `POST /upload`: Upload images
- `DELETE /delete_image/<filename>`: Delete an image
- `POST /update_face_name`: Update the name of a face
- `GET /faces`: Get list of faces
- `GET /search_face/<query>`: Search for faces by ID
- `DELETE /delete_face/<face_id>`: Delete a face

## Frontend

The frontend is built with React and Vite.

### Setup

1. Navigate to the `client` directory:

   ```sh
   cd client
   ```

2. Install the required packages:

   ```sh
   npm install
   ```

3. Run the development server:
   ```sh
   npm run dev
   ```

### API

The `src/api.js` file contains functions to interact with the backend API.

## License

This project is licensed under the MIT License.
