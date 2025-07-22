

import { useState } from "react";
import {  Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import greenLogo from "../../assets/green-logo.png";

import { useDispatch } from "react-redux";
import { setCredentials } from "../../Redux/features/auth/authSlice";
import { useLoginMutation } from "../../Redux/features/auth/authApi";
import type { AppDispatch } from "../../Redux/app/store";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
      console.log("Login successful:", result);

      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.user.role);


      Swal.fire({
        icon: "success",
        title: "Login successful",
        timer: 2000,
        showConfirmButton: false,
      });



      navigate("/dashboard");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Invalid Credentials",
        text: error?.data?.error || "Email or password is incorrect.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-14 self-stretch min-h-screen bg-white px-4 py-8">
      {/* Upper Section */}
      <div className="flex flex-col items-center gap-4 w-full">
        <span className="text-lg font-medium text-gray-700">Welcome to</span>
        <img src={greenLogo} alt="Green Logo" />
        <span className="text-2xl font-bold text-green-900">MVV portal</span>
      </div>

      {/* Middle Section */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <div className="flex flex-col items-start gap-2 w-full">
          <h2 className="text-xl font-semibold text-gray-900">Login to your account</h2>
          <p className="text-base text-gray-500 text-center">
            Please enter your email & password to continue.
          </p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 px-6 bg-green-900 rounded flex justify-center items-center gap-1"
          >
            <span className="text-white text-base font-medium tracking-wide">
              {isLoading ? "Signing in..." : "Sign In"}
            </span>
          </button>
        </form>
      </div>

      {/* Lower Section */}
      <div className="flex flex-col items-center gap-2 w-full">
        <span className="text-base text-gray-700">Go to our Website</span>
        <span className="text-lg font-semibold text-green-700">Instant Quote</span>
      </div>
    </div>
  );
};

export default LoginPage;
