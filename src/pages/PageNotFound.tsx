import React from "react";
import { Link } from "react-router-dom";

export const PageNotFound: React.FC = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl mt-4">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Go back to Home
        </Link>
      </div>
    </>
  );
};
