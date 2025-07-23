import { Link } from 'react-router-dom';
import React from "react";


export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-blue-50 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-blue-700">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md">
        Oops! The page you're looking for doesn't exist or might have been moved.
      </p>
      <Link
        to="/dashboard"
        className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md transition text-sm sm:text-base"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}