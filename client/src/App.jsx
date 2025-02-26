import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [images, setImages] = useState([]);
  const [faces, setFaces] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingFace, setEditingFace] = useState(null);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Delete an image
  const deleteImage = async (filename) => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:5000/delete_image/${filename}`, { method: "DELETE" });
      const data = await res.json();
      setUploadMessage(data.message);
      setTimeout(() => setUploadMessage(""), 3000);
      loadGallery();
    } catch (error) {
      console.error("Failed to delete image:", error);
      setUploadMessage("Failed to delete image");
    } finally {
      setIsLoading(false);
    }
  };

  // Load gallery and faces on component mount
  useEffect(() => {
    loadGallery();
  }, []);

  // Update face name
  const updateFaceName = async (faceId) => {
    if (!newName.trim()) return;
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/update_face_name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ face_id: faceId, new_name: newName }),
      });
      const data = await res.json();
      setUploadMessage(data.message);
      setTimeout(() => setUploadMessage(""), 3000);
      setEditingFace(null);
      setNewName("");
      loadGallery();
    } catch (error) {
      console.error("Failed to update face name:", error);
      setUploadMessage("Failed to update name");
    } finally {
      setIsLoading(false);
    }
  };

  // Load gallery and faces
  const loadGallery = async () => {
    try {
      setIsLoading(true);
      const imageRes = await fetch("http://localhost:5000/gallery");
      const imageData = await imageRes.json();
      setImages(imageData.images);

      const faceRes = await fetch("http://localhost:5000/faces");
      const faceData = await faceRes.json();
      setFaces(faceData.faces);
    } catch (error) {
      console.error("Error loading gallery:", error);
      setUploadMessage("Failed to load gallery");
    } finally {
      setIsLoading(false);
    }
  };

  // Search for a face
  const searchFace = async () => {
    if (!searchQuery.trim()) return;
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:5000/search_face/${searchQuery}`);
      const data = await res.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Search failed:", error);
      setUploadMessage("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8"
      >
        Face Recognition Gallery
      </motion.h1>

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto my-6 bg-white p-6 rounded-xl shadow-xl border border-purple-100"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Image</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            const formData = new FormData();
            const files = e.target.files.files;

            for (let file of files) {
              formData.append("files", file);
            }

            try {
              const res = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();
              setUploadMessage(data.message);
              setTimeout(() => setUploadMessage(""), 3000);
              loadGallery();
            } catch (error) {
              console.error("Upload failed:", error);
              setUploadMessage("Upload failed");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 transition duration-300 hover:border-blue-500">
            <input type="file" name="files" multiple required className="w-full" />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className={`mt-4 py-2 px-4 rounded-lg w-full font-medium text-white ${
              isLoading ? "bg-gray-400" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            } transition duration-300 transform`}
          >
            {isLoading ? "Processing..." : "Upload Images"}
          </motion.button>
        </form>

        {uploadMessage && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-green-600 mt-3 text-center font-medium"
          >
            {uploadMessage}
          </motion.p>
        )}
      </motion.div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-700 mt-3">Processing...</p>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="my-12"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 pl-2 border-l-4 border-blue-500">
          All Uploaded Images
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src={`http://localhost:5000/uploads/${img}`}
                alt="Uploaded"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteImage(img)}
                  className="absolute bottom-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Faces Gallery */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="my-12"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 pl-2 border-l-4 border-purple-500">
          Detected Faces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faces.map((face, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-purple-100"
            >
              <div className="p-5">
                {editingFace === face.face_id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 border-2 border-blue-300 focus:border-blue-500 p-2 rounded-lg outline-none transition duration-200"
                      placeholder="Enter new name..."
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateFaceName(face.face_id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-medium transition duration-200"
                    >
                      Save
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-800">
                      {face.name || "Unnamed Face"}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingFace(face.face_id);
                        setNewName(face.name || "");
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded-md hover:bg-blue-50 transition duration-200"
                    >
                      Rename
                    </motion.button>
                  </div>
                )}
              </div>

              <div className="flex overflow-x-auto gap-2 p-3 bg-gray-50">
                {face.images.map((img, i) => (
                  <motion.img
                    key={i}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    transition={{ duration: 0.2 }}
                    src={`http://localhost:5000/uploads/${img.split("/").pop()}`}
                    alt="Face"
                    className="w-16 h-16 object-cover rounded-md shadow-md flex-shrink-0"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Search Face */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="my-12"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 pl-2 border-l-4 border-green-500">
          Search Face
        </h2>
        <div className="max-w-md mx-auto">
          <div className="flex gap-3 bg-white p-2 rounded-full shadow-md border border-green-100">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchFace()}
              placeholder="Enter Face Name"
              className="flex-1 p-2 pl-4 outline-none rounded-full"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={searchFace}
              disabled={isLoading}
              className={`${
                isLoading ? "bg-gray-400" : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              } text-white px-6 py-2 rounded-full font-medium transition duration-300`}
            >
              Search
            </motion.button>
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-6"
        >
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {searchResults.flatMap((face) => face.images).map((img, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition duration-300"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={`http://localhost:5000/uploads/${img}`}
                    alt="Matched"
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
              ))}
            </div>
          ) : searchQuery && !isLoading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 mt-8 text-center font-medium bg-white p-4 rounded-lg shadow-md"
            >
              No matches found for "{searchQuery}".
            </motion.p>
          ) : null}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;