/* eslint-disable @typescript-eslint/no-unused-vars */
//------------------//--------------------------------//--------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
// Adjust path if needed

import { baseApi } from "../../app/api/baseApi";
import type {
  AuthResponse,
  LoginPayload,
  ChangePasswordPayload,
  ForgetPasswordPayload,
  OtpVerifyForgetPasswordPayload,
  RefreshTokenResponse,
  OtpResponse,
} from "./auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [
        "Me",
        "Users",
        "Quotes",
        "Projects",
        "Dashbord",
        "Labours",
      ],
    }),

    changePassword: builder.mutation<any, ChangePasswordPayload>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error) => [
        { type: "Users" }, // refresh this user
        "Me", // refresh /me if current user is updated
      ],
    }),

    forgetPassword: builder.mutation<any, ForgetPasswordPayload>({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<
      any,
      { email: string; newPassword: string; token: string }
    >({
      query: ({ email, newPassword, token }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { email, newPassword },
        token,
      }),
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),

    otpVerifyForgetPassword: builder.mutation<
      OtpResponse,
      OtpVerifyForgetPasswordPayload
    >({
      query: (data) => ({
        url: "/otps/verify-forget-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useOtpVerifyForgetPasswordMutation,
} = authApi;
