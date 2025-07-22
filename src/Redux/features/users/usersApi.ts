import { baseApi } from "../../app/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createClient: builder.mutation({
      query: (userData) => ({
        url: '/create-client',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),
    createPrimeAdmin: builder.mutation({
      query: (userData) => ({
        url: '/create-prime-admin',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),
    createBasicAdmin: builder.mutation({
      query: (userData) => ({
        url: '/create-basic-admin',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
    }),
  }),
});

export const {
  useCreateClientMutation,
  useCreatePrimeAdminMutation,
  useCreateBasicAdminMutation,
  useGetAllUsersQuery,
} = userApi;