import { baseApi } from '../../app/api/baseApi';

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<any[], { status?: string } | void>({
      query: (params) => {
        console.log(params?.status)
        const queryString = params?.status ;
        return `/projects${queryString}`;
      },
      providesTags: ['Projects'],
      transformResponse: (response: { status: string; data: any[] }) => {
        // Your mock returns { status, data: [...] }, so return only data array
        return response.data;
      },
    }),
  }),
});

export const { useGetProjectsQuery } = projectsApi;
