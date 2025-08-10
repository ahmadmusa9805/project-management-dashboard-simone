/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import greenLogo from "../../assets/green-logo.png";

// import { useDispatch } from "react-redux";
// import { setCredentials } from "../../Redux/features/auth/authSlice";
// import { useLoginMutation } from "../../Redux/features/auth/authApi";
// import type { AppDispatch } from "../../Redux/app/store";
// import { successAlert } from "../../utils/alerts";
// import { jwtDecode } from "jwt-decode";
// import { USER_ROLE } from "../../types/userAllTypes/user";

// const LoginPage = () => {
//   type Mode = "login" | "forgot" | "verifyOtp" | "resetPassword";
//   const [mode, setMode] = useState<Mode>("login");
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");

//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const [login, { isLoading }] = useLoginMutation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (mode === "login") {
//       try {
//         const result = await login({ email, password }).unwrap();
//         dispatch(setCredentials(result));

//         const decoded = jwtDecode<{ userEmail: string; role: string }>(
//           result.accessToken
//         );

//         successAlert("Login successful", "You have successfully logged in.");
//         if (decoded.role === USER_ROLE.superAdmin) {
//           navigate("/dashboard");
//         } else {
//           navigate("/projects?status=ongoing");
//         }
//       } catch (error: any) {
//         Swal.fire({
//           icon: "error",
//           title: "Invalid Credentials",
//           text: error?.data?.error || "Email or password is incorrect.",
//         });
//       }
//     }

//     if (mode === "forgot") {
//       // Send OTP API
//       successAlert("OTP Sent", "Please check your email for the OTP.");
//       setMode("verifyOtp");
//     }

//     if (mode === "verifyOtp") {
//       // Verify OTP API
//       successAlert("OTP Verified", "Now set your new password.");
//       setMode("resetPassword");
//     }

//     if (mode === "resetPassword") {
//       // Reset password API call
//       successAlert(
//         "Password Reset",
//         "You can now log in with your new password."
//       );
//       setMode("login");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center gap-14 self-stretch min-h-screen bg-white px-4 py-8">
//       {/* Upper Section */}
//       <div className="flex flex-col items-center gap-4 w-full">
//         <span className="text-lg font-medium text-gray-700">Welcome to</span>
//         <img src={greenLogo} alt="Green Logo" />
//         <span className="text-2xl font-bold text-green-900">MVV portal</span>
//       </div>

//       {/* Middle Section */}
//       <div className="flex flex-col items-center gap-6 w-full max-w-md">
//         <div className="flex flex-col items-start gap-2 w-full">
//           <h2 className="text-xl font-semibold text-gray-900">
//             {mode === "login"
//               ? "Login to your account"
//               : mode === "forgot"
//               ? "Forgot Password"
//               : mode === "verifyOtp"
//               ? "Verify OTP"
//               : "Reset Password"}
//           </h2>
//           <p className="text-base text-gray-500 text-center">
//             {mode === "login"
//               ? "Please enter your email & password to continue."
//               : mode === "forgot"
//               ? "Enter your email to receive an OTP."
//               : mode === "verifyOtp"
//               ? "Enter the OTP sent to your email."
//               : "Enter your new password."}
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
//           {/* Email input */}
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             required
//             readOnly={mode === "resetPassword"} // make read-only in reset password mode
//             className={`w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 ${
//               mode === "resetPassword" ? "bg-gray-100" : ""
//             }`}
//           />

//           {/* Password input for login */}
//           {mode === "login" && (
//             <div className="relative w-full">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 pr-12"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 aria-label="Toggle password visibility"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           )}

//           {/* OTP input */}
//           {mode === "verifyOtp" && (
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
//             />
//           )}

//           {/* New password input for resetPassword */}
//           {mode === "resetPassword" && (
//             <div className="relative w-full">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your new password"
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 pr-12"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 aria-label="Toggle password visibility"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           )}

//           {/* Submit button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full h-12 px-6 bg-green-900 rounded flex justify-center items-center gap-1"
//           >
//             <span className="text-white text-base font-medium tracking-wide">
//               {isLoading
//                 ? "Processing..."
//                 : mode === "login"
//                 ? "Sign In"
//                 : mode === "forgot"
//                 ? "Send OTP"
//                 : mode === "verifyOtp"
//                 ? "Verify OTP"
//                 : "Reset Password"}
//             </span>
//           </button>
//         </form>

//         {/* Forgot password link */}
//         {mode === "login" && (
//           <button
//             type="button"
//             onClick={() => setMode("forgot")}
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Forgot Password?
//           </button>
//         )}
//       </div>

//       {/* Lower Section */}
//       <div className="flex flex-col items-center gap-2 w-full">
//         <Link to={"https://www.themvv.co.uk/"}>
//           <span className="text-base text-gray-500 underline hover:text-gray-900">
//             Go to our Website
//           </span>
//         </Link>
//         <span className="text-lg font-semibold text-green-700">
//           Instant Quote
//         </span>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

/* src/pages/auth/LoginPage.tsx */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import greenLogo from "../../assets/green-logo.png";

import { useDispatch } from "react-redux";
import { setCredentials } from "../../Redux/features/auth/authSlice";
import {
  useLoginMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useOtpVerifyForgetPasswordMutation,
} from "../../Redux/features/auth/authApi";
import type { AppDispatch } from "../../Redux/app/store";
import { successAlert, errorAlert } from "../../utils/alerts"; // recommended default import
import { USER_ROLE } from "../../types/userAllTypes/user";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  type Mode = "login" | "forgot" | "verifyOtp" | "resetPassword";
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);

  // shared fields
  const [email, setEmail] = useState("");
  // used as either login password or new password depending on mode
  const [password, setPassword] = useState("");

  // OTP & reset state
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // hooks
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [forgetPassword, { isLoading: isSendingForget }] =
    useForgetPasswordMutation();
  const [otpVerifyForget, { isLoading: isVerifyingOtp }] =
    useOtpVerifyForgetPasswordMutation();
  const [resetPasswordMut, { isLoading: isResetting }] =
    useResetPasswordMutation();

  // Helper to extract token from response flexibly
  const extractResetToken = (res: any): string | null => {
    if (!res) return null;
    // backend might return: { data: { token: '...' } } or { token: '...' } or just string
    return (
      res?.data?.token ||
      res?.token ||
      res?.data?.resetToken ||
      res?.resetToken ||
      (typeof res === "string" ? res : null)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      try {
        const result = await login({ email, password }).unwrap();
        dispatch(setCredentials(result));

        // decode token to route by role (your code used jwtDecode earlier)
        const decoded = jwtDecode<{ role?: string }>(result.accessToken || "");
        successAlert("Login successful", "You have successfully logged in.");

        if (decoded?.role === USER_ROLE.superAdmin) {
          navigate("/dashboard");
        } else {
          navigate("/projects?status=ongoing");
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Invalid Credentials",
          text: error?.data?.error || "Email or password is incorrect.",
        });
      }
      return;
    }

    if (mode === "forgot") {
      try {
        // call forgetPassword - backend should trigger OTP send / return info
        await forgetPassword({ email }).unwrap();
        successAlert("OTP Sent", "Please check your email for the OTP.");
        // optionally, backend might return something; continue to OTP input step
        setMode("verifyOtp");
      } catch (err: any) {
        errorAlert(err?.data?.message || "Failed to send OTP");
      }
      return;
    }

    if (mode === "verifyOtp") {
      try {
        // call OTP verify-forget-password, backend should return reset token
        const res = await otpVerifyForget({ email, otp }).unwrap();
        const token = extractResetToken(res);
        if (!token) {
          // If backend does not return token, still proceed if success response indicates so
          successAlert("OTP Verified", "Now set your new password.");
          setMode("resetPassword");
          return;
        }
        console.log(token);
        setResetToken(token);
        successAlert("OTP Verified", "Now set your new password.");
        setMode("resetPassword");
      } catch (err: any) {
        errorAlert(err?.data?.message || "OTP verification failed.");
      }
      return;
    }

    if (mode === "resetPassword") {
      if (password !== confirmPassword) {
        errorAlert("Passwords do not match");
        return;
      }
      console.log(resetToken);

      try {
        // call resetPassword — pass token in headers param
        await resetPasswordMut({
          email,
          newPassword: password,
          token: resetToken ?? "",
        }).unwrap();

        successAlert(
          "Password Reset",
          "You can now log in with your new password."
        );
        // reset fields and go to login
        setPassword("");
        setConfirmPassword("");
        setOtp("");
        setResetToken(null);
        setMode("login");
      } catch (err: any) {
        errorAlert(err?.data?.message || "Failed to reset password.");
      }
      return;
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
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "login"
              ? "Login to your account"
              : mode === "forgot"
              ? "Forgot Password"
              : mode === "verifyOtp"
              ? "Verify OTP"
              : "Reset Password"}
          </h2>
          <p className="text-base text-gray-500 text-center">
            {mode === "login"
              ? "Please enter your email & password to continue."
              : mode === "forgot"
              ? "Enter your email to receive an OTP."
              : mode === "verifyOtp"
              ? "Enter the OTP sent to your email."
              : "Enter your new password."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* Email input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            readOnly={mode === "resetPassword"} // read-only in reset stage (we still show it)
            className={`w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 ${
              mode === "resetPassword" ? "bg-gray-100" : ""
            }`}
          />

          {/* Password input for login */}
          {mode === "login" && (
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
          )}

          {/* OTP input */}
          {mode === "verifyOtp" && (
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          )}

          {/* New password + confirm for resetPassword */}
          {mode === "resetPassword" && (
            <>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
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

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </>
          )}

          {/* Submit button — show the relevant loading flag */}
          <button
            type="submit"
            disabled={
              isLoggingIn || isSendingForget || isVerifyingOtp || isResetting
            }
            className="w-full h-12 px-6 bg-green-900 rounded flex justify-center items-center gap-1"
          >
            <span className="text-white text-base font-medium tracking-wide">
              {isLoggingIn || isSendingForget || isVerifyingOtp || isResetting
                ? "Processing..."
                : mode === "login"
                ? "Sign In"
                : mode === "forgot"
                ? "Send OTP"
                : mode === "verifyOtp"
                ? "Verify OTP"
                : "Reset Password"}
            </span>
          </button>
        </form>

        {/* Forgot password link */}
        {mode === "login" && (
          <button
            type="button"
            onClick={() => setMode("forgot")}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        )}
      </div>

      {/* Lower Section */}
      <div className="flex flex-col items-center gap-2 w-full">
        <Link to={"https://www.themvv.co.uk/"}>
          <span className="text-base text-gray-500 underline hover:text-gray-900">
            Go to our Website
          </span>
        </Link>
        <span className="text-lg font-semibold text-green-700">
          Instant Quote
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
