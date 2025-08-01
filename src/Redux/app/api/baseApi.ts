import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Dashbord", "Projects", "Users"], // Add more tags as needed like 'Projects', 'Auth', etc.
  endpoints: () => ({}), // Extend this in child APIs
});
