/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AuthResponse, LoginPayload } from "./auth.types";
const musaVaiApi = "http://192.168.0.100:5001";
//const myApi = "http://localhost:5001";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${musaVaiApi}/api/v1` }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => {
        return response.data; // ✅ extract only accessToken from `data`
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
