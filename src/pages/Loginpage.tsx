import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../service/auth";

export default function Loginpage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const data = await login({ email, password });

      // Save tokens in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      // localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password");
    }
  };
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md transition-colors"
          >
            Login
          </button>
          {error && <p className="text-red-400 text-center">{error}</p>}
        </div>
        <p className="mt-4 text-center text-gray-400">
            Already have an account?{" "}
            <a
              href="#"
              onClick={handleClick}
              className="text-blue-500 hover:underline"
            >
              Signup
            </a>
          </p>
      </div>
    </div>
  );
}
