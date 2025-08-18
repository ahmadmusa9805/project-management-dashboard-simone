/* eslint-disable @typescript-eslint/no-explicit-any */
// import { baseApi } from "../../app/api/baseApi";

// export const userApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     createClient: builder.mutation({
//       query: (userData) => ({
//         url: '/create-client',
//         method: 'POST',
//         body: userData,
//       }),
//       invalidatesTags: ['Users'],
//     }),
//     createPrimeAdmin: builder.mutation({
//       query: (userData) => ({
//         url: '/create-prime-admin',
//         method: 'POST',
//         body: userData,
//       }),
//       invalidatesTags: ['Users'],
//     }),
//     createBasicAdmin: builder.mutation({
//       query: (userData) => ({
//         url: '/create-basic-admin',
//         method: 'POST',
//         body: userData,
//       }),
//       invalidatesTags: ['Users'],
//     }),
//     getAllUsers: builder.query({
//       query: () => '/users',
//       providesTags: ['Users'],
//     }),
//   }),
// });

// export const {
//   useCreateClientMutation,
//   useCreatePrimeAdminMutation,
//   useCreateBasicAdminMutation,
//   useGetAllUsersQuery,
// } = userApi;

// features/users/usersApi.ts

import { baseApi } from "../../app/api/baseApi";
import type { SingleUserResponse, User, UserApiResponse } from "./users.types";
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<UserApiResponse, { status?: string }>({
      query: ({ status }) => {
        const params = new URLSearchParams();
        params.append("sort", "-createdAt");
        if (status) params.append("status", status);
        return `/users?${params.toString()}`;
      },
      transformResponse: (response: any) => response,
      providesTags: ["Users"],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),
    getMeUser: builder.query<User, void>({
      query: () => `/users/me`,
      transformResponse: (response: SingleUserResponse): User => response.data,
      providesTags: ["Users"],
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: "/users/create-user",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    changeUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/change-status/${id}`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Users",
        { type: "Users", id },
      ],
    }),

    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useGetMeUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserStatusMutation,
} = usersApi;
