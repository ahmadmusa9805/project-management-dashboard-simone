import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
// adjust path if needed
const musaVaiApi = "http://192.168.0.100:5001";
//const myApi = "http://localhost:5001";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${musaVaiApi}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", token);
      }

      return headers;
    },
  }),
  tagTypes: ["Dashbord", "Projects", "Users","Quotes","Labours"],
  endpoints: () => ({}),
});
