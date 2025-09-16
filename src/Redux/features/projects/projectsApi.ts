/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../app/api/baseApi";
export type SharedUser = { userId: string; role: string };
export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getProjectsWithstatus: builder.query<any[], { status?: string } | void>({
    //   query: (params) => {
    //     const queryString = params?.status ? `?status=${params.status}` : "";
    //     return `/projects${queryString}`;
    //   },
    //   providesTags: ["Projects"],
    //   transformResponse: (response: { status: string; data: any[] }) => {
    //     return Array.isArray(response.data) ? response.data : [];
    //   },
    // }),

    // getProjectsWithstatus: builder.query<
    //   {
    //     data: any[];
    //     meta: { page: number; limit: number; total: number; totalPage: number };
    //   },
    //   { status?: string; page?: number; limit?: number; search?: string } | void
    // >({
    //   query: ({ status = "", page = 1, limit = 10, search = "" } = {}) => {
    //     let qs = `?page=${page}&limit=${limit}`;
    //     if (status) qs += `&status=${encodeURIComponent(status)}`;
    //     if (search) qs += `&search=${encodeURIComponent(search)}`;
    //     return `/projects${qs}`;
    //   },
    //   transformResponse: (response: any) => response,
    //   providesTags: ["Projects"],
    // }),

    getProjectsWithstatus: builder.query<
      {
        data: any[];
        meta: { page: number; limit: number; total: number; totalPage: number };
      },
      {
        status?: string | string[];
        page?: number;
        limit?: number;
        search?: string;
      } | void
    >({
      query: ({ status = "", page = 1, limit = 10, search = "" } = {}) => {
        let qs = `?page=${page}&limit=${limit}`;
        // if (status) qs += `&status=${encodeURIComponent(status)}`;
        if (status) {
          if (Array.isArray(status)) {
            // multiple statuses
            qs += status
              .map((s) => `&status=${encodeURIComponent(s)}`)
              .join("");
          } else {
            // single status
            qs += `&status=${encodeURIComponent(status)}`;
          }
        }
        if (search) qs += `&search=${encodeURIComponent(search)}`;
        return `/projects${qs}`;
      },
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: any[];
        meta: any;
      }) => {
        return {
          data: Array.isArray(response.data) ? response.data : [],
          meta: response.meta || { page: 1, limit: 10, total: 0, totalPage: 1 },
        };
      },
      providesTags: ["Projects"],
    }),

    getSingleProject: builder.query<any, { id: string }>({
      query: ({ id }) => `/projects/${id}`,
      providesTags: ["Projects"],
      transformResponse: (response: { status: string; data: any }) => {
        return response.data;
      },
    }),

    createProject: builder.mutation<any, any>({
      query: (data) => ({
        url: "/projects/create-project",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),

    updateProject: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
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

    shareProject: builder.mutation<
      any, // or the response type
      { id: string; sharedWith: SharedUser[] }
    >({
      query: ({ id, sharedWith }) => ({
        url: `/projects/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: ["Projects"],
    }),

    unShareProject: builder.mutation<
      any, // Response type
      { id: string; unShareWith: string[] } // Argument type
    >({
      query: ({ id, unShareWith }) => ({
        url: `/projects/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsWithstatusQuery,
  useGetSingleProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useShareProjectMutation,
  useUnShareProjectMutation,
} = projectsApi;
