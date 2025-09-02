import { useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { register } from "../service/auth";

export default function RegisterPage() {
  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // clear error when user types
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      const newErrors: FormErrors = {};

      if (!formData.firstName) {
        newErrors.firstName = "First Name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last Name is required";
      }
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is not valid";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        const result = await register(formData);
        console.log("result", result);
        // Save tokens in localStorage
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);

        navigate("/dashboard");
        if (result.status === 201) {
          setFormData({ firstName: "", lastName: "", email: "", password: "" });
        }
        setErrors({});
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const navigate: NavigateFunction = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-4 bg-gray-950 text-white">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
          <div className="space-y-4">
            {/* First Name */}
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
              value={formData.firstName.trim()}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}

            {/* Last Name */}
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
              value={formData.lastName.trim()}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}

            {/* Email */}
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
              value={formData.email.trim()}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
              value={formData.password.trim()}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}

            {/* Submit */}
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-md transition-colors"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>

          <p className="mt-4 text-center text-gray-400">
            Already have an account?{" "}
            <a
              href="#"
              onClick={handleClick}
              className="text-green-400 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
