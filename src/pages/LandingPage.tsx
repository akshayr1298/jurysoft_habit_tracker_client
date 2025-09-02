import React from "react";
// import Header from "../components/common/Layout/Header";
// import headerLogo from "../../src/assets/instagram.png";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";

const LandingPage: React.FC = () => {
  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-4 text-center bg-gray-800 text-white">
          <h2 className="text-4xl font-extrabold mb-4">
            Track Your Habits, Master Your Life
          </h2>
          <p className="text-lg mb-8 max-w-2xl">
            Take control of your daily routine and build better habits. Our
            simple tracker helps you stay consistent and motivated.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
