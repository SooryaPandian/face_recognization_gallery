// src/components/FaceGallery.jsx
import { motion } from "framer-motion";
import { updateFaceName } from "../api";

export const FaceGallery = ({ faces, setIsLoading, setUploadMessage, loadGallery }) => {
  const [editingFace, setEditingFace] = useState(null);
  const [newName, setNewName] = useState("");

  const handleUpdateName = async (faceId) => {
    if (!newName.trim()) return;
    setIsLoading(true);
    try {
      const data = await updateFaceName(faceId, newName);
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      className="my-12"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 pl-2 border-l-4 border-purple-500">
        Detected Faces
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {faces.map((face, index) => (
          <motion.div
            key={index}
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
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
                    onClick={() => handleUpdateName(face.face_id)}
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
  );
};