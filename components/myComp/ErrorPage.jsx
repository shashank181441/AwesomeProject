import { useNavigation } from 'expo-router';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigation();
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-6">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-red-500">Error</h1>
        <p className="text-lg text-gray-600 my-4">
          Oops! Something went wrong while loading the data.
        </p>
        <a
        //   onClick={() => navigate("/")}
        href={`/${location}`}
          className="mt-16 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Refresh
        </a>
      </div>
      <img
        src="https://cdn-icons-png.flaticon.com/512/2621/2621165.png"
        alt="Error illustration"
        className="mt-8 max-w-md"
      />
    </div>
  );
}
