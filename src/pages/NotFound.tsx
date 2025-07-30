import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center bg-white rounded-2xl shadow-lg p-8 sm:p-12 max-w-md w-full transition-all duration-300 hover:shadow-xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          404
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-blue-50 rounded-full px-4 py-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;