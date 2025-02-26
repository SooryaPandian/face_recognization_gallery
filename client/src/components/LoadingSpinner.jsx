// src/components/LoadingSpinner.jsx
export const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-xl">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-700 mt-3">Processing...</p>
      </div>
    </div>
  );