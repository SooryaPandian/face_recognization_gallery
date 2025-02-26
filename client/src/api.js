// src/api.js
export const deleteImage = async (filename) => {
    const res = await fetch(`http://localhost:5000/delete_image/${filename}`, { method: "DELETE" });
    return await res.json();
  };
  
  export const updateFaceName = async (faceId, newName) => {
    const res = await fetch("http://localhost:5000/update_face_name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ face_id: faceId, new_name: newName }),
    });
    return await res.json();
  };
  
  export const loadGallery = async () => {
    const imageRes = await fetch("http://localhost:5000/gallery");
    const imageData = await imageRes.json();
  
    const faceRes = await fetch("http://localhost:5000/faces");
    const faceData = await faceRes.json();
  
    return { images: imageData.images, faces: faceData.faces };
  };
  
  export const searchFace = async (query) => {
    const res = await fetch(`http://localhost:5000/search_face/${query}`);
    return await res.json();
  };
  
  export const uploadImages = async (files) => {
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
    return await res.json();
  };