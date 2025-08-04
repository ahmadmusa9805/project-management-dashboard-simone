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
    // 👇 This is the part you need to modify

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
      query: (formData) => ({
        url: "/users/create-user",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users"],
    }),
    // usersApi.ts
    changeUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/change-status/${id}`,
        method: "POST", // use PATCH if your backend expects it
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

    // ✅ Create Labor user
    createLaborUser: builder.mutation({
      query: (userData) => ({
        url: "/users/create-labor", // you must define this route in your backend
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ Update Labor user
    updateLaborUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/update-labor/${id}`, // you must define this route in backend
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Users",
        { type: "Users", id },
      ],
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
  useCreateLaborUserMutation,
  useUpdateLaborUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserStatusMutation,
} = usersApi;
