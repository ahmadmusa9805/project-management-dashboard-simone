/* eslint-disable @typescript-eslint/no-explicit-any */
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type {
//   AuthResponse,
//   LoginPayload,
//   ChangePasswordPayload,
//   ForgetPasswordPayload,
//   OtpVerifyForgetPasswordPayload,
//   RefreshTokenResponse,
//   OtpResponse,
// } from "./auth.types";

// // const apiBase = "http://192.168.0.100:5001";
// const apiBase = "http://localhost:5001";

// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery: fetchBaseQuery({ baseUrl: `${apiBase}/api/v1` }),
//   endpoints: (builder) => ({
//     //===== AUTH =====
//     login: builder.mutation<AuthResponse, LoginPayload>({
//       query: (credentials) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: credentials,
//       }),
//       transformResponse: (response: any) => response.data,
//     }),

//     changePassword: builder.mutation<any, ChangePasswordPayload>({
//       query: (data) => ({
//         url: "/auth/change-password",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     forgetPassword: builder.mutation<any, ForgetPasswordPayload>({
//       query: (data) => ({
//         url: "/auth/forget-password",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     resetPassword: builder.mutation<
//       any,
//       { email: string; newPassword: string; token: string }
//     >({
//       query: ({ email, newPassword, token }) => ({
//         url: "/auth/reset-password",
//         method: "POST",
//         body: { email, newPassword },
//         headers: {
//           Authorization: token, // or `Bearer ${token}` if your backend expects that format
//         },
//       }),
//     }),

//     refreshToken: builder.mutation<RefreshTokenResponse, void>({
//       query: () => ({
//         url: "/auth/refresh-token",
//         method: "POST",
//       }),
//     }),

//     otpVerifyForgetPassword: builder.mutation<
//       OtpResponse,
//       OtpVerifyForgetPasswordPayload
//     >({
//       query: (data) => ({
//         url: "/otps/verify-forget-password",
//         method: "POST",
//         body: data,
//       }),
//     }),
//   }),
// });

// export const {
//   useLoginMutation,
//   useChangePasswordMutation,
//   useForgetPasswordMutation,
//   useResetPasswordMutation,
//   useRefreshTokenMutation,
//   useOtpVerifyForgetPasswordMutation,
// } = authApi;

//------------------//--------------------------------//--------------------------------

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AuthResponse,
  LoginPayload,
  ChangePasswordPayload,
  ForgetPasswordPayload,
  OtpVerifyForgetPasswordPayload,
  RefreshTokenResponse,
  OtpResponse,
} from "./auth.types";

 const apiBase = "http://192.168.0.100:5001";
//const apiBase = "http://localhost:5001";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${apiBase}/api/v1` }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response.data,
    }),

    changePassword: builder.mutation<any, ChangePasswordPayload>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
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
        headers: {
          Authorization: token, // or `Bearer ${token}` if needed
        },
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
