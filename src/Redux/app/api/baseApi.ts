import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
 // adjust path if needed

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.0.100:5001/api/v1",
   prepareHeaders: (headers, { getState, extra }) => {
  const token = (getState() as RootState).auth.token;

  if (token) {
    headers.set("Authorization", token);
  }

  // ✅ Only set Content-Type if not using FormData
  if (!(extra instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

  }),
  tagTypes: ["Dashbord", "Projects", "Users"],
  endpoints: () => ({}),
});
