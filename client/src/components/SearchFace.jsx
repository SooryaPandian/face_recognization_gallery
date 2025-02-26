  // src/components/SearchFace.jsx
import { motion } from "framer-motion";
import { searchFace } from "../api";

export const SearchFace = ({ searchQuery, setSearchQuery, setSearchResults, setIsLoading }) => {
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const data = await searchFace(searchQuery);
      setSearchResults(data.results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Enter Face Name"
            className="flex-1 p-2 pl-4 outline-none rounded-full"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2 rounded-full font-medium transition duration-300"
          >
            Search
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};