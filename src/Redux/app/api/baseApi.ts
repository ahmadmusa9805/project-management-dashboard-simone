import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://350c6bd4-4a04-4d89-bf9d-1f835ff83bd4.mock.pstmn.io',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Users','Dashbord'], // Add more tags as needed like 'Projects', 'Auth', etc.
  endpoints: () => ({}), // Extend this in child APIs
});