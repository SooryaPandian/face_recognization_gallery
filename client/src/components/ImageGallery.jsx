// src/components/ImageGallery.jsx
import { motion } from "framer-motion";
import { deleteImage } from "../api";

export const ImageGallery = ({ images, setIsLoading, setUploadMessage, loadGallery }) => {
  const handleDelete = async (filename) => {
    setIsLoading(true);
    try {
      const data = await deleteImage(filename);
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
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 pl-2 border-l-4 border-blue-500">
        All Uploaded Images
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img, index) => (
          <motion.div
            key={index}
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
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
                onClick={() => handleDelete(img)}
                className="absolute bottom-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};