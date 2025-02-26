// src/App.js
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { UploadForm } from "./components/UploadForm";
import { ImageGallery } from "./components/ImageGallery";
import { FaceGallery } from "./components/FaceGallery";
import { SearchFace } from "./components/SearchFace";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { loadGallery } from "./api";

export default function App() {
  const [images, setImages] = useState([]);
  const [faces, setFaces] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { images, faces } = await loadGallery();
        setImages(images);
        setFaces(faces);
      } catch (error) {
        console.error("Error loading gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <Header />
      <UploadForm setIsLoading={setIsLoading} setUploadMessage={setUploadMessage} loadGallery={loadGallery} />
      {isLoading && <LoadingSpinner />}
      <ImageGallery images={images} setIsLoading={setIsLoading} setUploadMessage={setUploadMessage} loadGallery={loadGallery} />
      <FaceGallery faces={faces} setIsLoading={setIsLoading} setUploadMessage={setUploadMessage} loadGallery={loadGallery} />
      <SearchFace searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSearchResults={setSearchResults} setIsLoading={setIsLoading} />
    </div>
  );
}