
import { baseApi } from "../../app/api/baseApi";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  })
});

export const {
  useGetProjectsWithstatusQuery,
  useGetSingleProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
