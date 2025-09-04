/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Redux/features/auth/auth.types.ts

// ==== Payload Types ====
export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
 
 oldPassword: string;
  newPassword: string;

}

export interface ForgetPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string; // only if your backend requires it
  newPassword: string; // new password
}

export interface GenerateOtpPayload {
  otp: string; // may also include email if backend requires
}

export interface OtpVerifyForgetPasswordPayload {
  otp: string;
  email?: string;
}

// ==== Response Types ====
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface OtpResponse {
  verified: boolean;
  [key: string]: any; // for any extra data backend sends
}

export interface ApiSuccess<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

// Only accessToken is received, no user object
export interface AuthResponse {
  accessToken: string;
}

// This must be extracted from the token
export interface User {
  email: string;
  role: "superAdmin" | "primeAdmin" | "basicAdmin" | "client";
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
