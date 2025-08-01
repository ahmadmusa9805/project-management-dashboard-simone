import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AuthResponse, LoginPayload } from "./auth.types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001/api/v1" }),
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
