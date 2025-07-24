// features/projects/dashbordApi.ts

import { baseApi } from "../../app/api/baseApi";


interface EarningData {
  month: string;
 earning: number;
}

export const dashbordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarningsByProject: builder.query<EarningData[], string>({
      query: (projectId) => `earnings/${projectId}`,
      providesTags: ['Dashbord'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetEarningsByProjectQuery } = dashbordApi;
