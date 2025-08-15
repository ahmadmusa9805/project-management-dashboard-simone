/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// const musaVaiApi = "http://192.168.0.100:5001";
const myApi = "http://localhost:5001";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${myApi}/api/v1`,
    prepareHeaders: (headers, { getState, arg }) => {
      let token: string | undefined;
      if (
        arg &&
        typeof arg === "object" &&
        "token" in arg &&
        typeof (arg as any).token === "string"
      ) {
        token = (arg as any).token;
      }

      if (!token) {
        token = (getState() as RootState)?.auth?.token as string | "";
      }

      if (token) {
        headers.set("Authorization", token);
      }

      // Only set JSON Content-Type if not sending FormData

      return headers;
    },
  }),
  tagTypes: [
    "Dashbord",
    "Projects",
    "Users",
    "Quotes",
    "Labours",
    "Interims",
    "MaterialExpenses",
    "LabourExpenses",
    "SubContractorsExpenses",
    "ProjectCosts",
  ],
  endpoints: () => ({}),
});
