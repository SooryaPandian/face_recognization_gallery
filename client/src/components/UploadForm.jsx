// src/components/UploadForm.jsx
import { motion } from "framer-motion";
import { uploadImages } from "../api";

export const UploadForm = ({ setIsLoading, setUploadMessage, loadGallery }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const files = e.target.files.files;

    try {
      const data = await uploadImages(files);
      setUploadMessage(data.message);
      setTimeout(() => setUploadMessage(""), 3000);
      loadGallery();
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadMessage("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto my-6 bg-white p-6 rounded-xl shadow-xl border border-purple-100"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 transition duration-300 hover:border-blue-500">
          <input type="file" name="files" multiple required className="w-full" />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="mt-4 py-2 px-4 rounded-lg w-full font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300 transform"
        >
          Upload Images
        </motion.button>
      </form>
    </motion.div>
  );
};