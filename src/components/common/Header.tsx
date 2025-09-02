import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/"); // Redirect to landing page
  };

  return (
     <header className="fixed top-0 left-0 w-full z-50 p-4 bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
        <nav>
          <ul className="flex space-x-4">
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer  bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
