/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Redux/features/projects/projectsApi.ts

import { baseApi } from "../../app/api/baseApi";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getProjects: builder.query<any[], void>({
    //   query: () => {
    //     return `/projects`;
    //   },
    //   providesTags: ["Projects"],
    //   transformResponse: (response: { data: any[] }) => {
    //     return Array.isArray(response.data) ? response.data : [];
    //   },
    // }),
    getProjectsWithstatus: builder.query<any[], { status?: string } | void>({
      query: (params) => {
        const queryString = params?.status ? `?status=${params.status}` : "";
        return `/projects${queryString}`;
      },
      providesTags: ["Projects"],
      transformResponse: (response: { status: string; data: any[] }) => {
        return Array.isArray(response.data) ? response.data : [];
      },
    }),

    createProject: builder.mutation<any, any>({
      query: (data) => {
        // console.log("Creating Project with Data:", data);
        return {
          url: "/projects",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Projects"],
    }),

    updateProject: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),

    deleteProject: builder.mutation<any, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  // useGetProjectsQuery,
  useGetProjectsWithstatusQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
