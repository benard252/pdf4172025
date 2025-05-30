
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <AlertTriangle size={64} className="text-yellow-400 mb-6" />
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-300 mb-6">Page Not Found</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-lg transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};
