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

import type { UploadFile } from "antd";

interface User {
  id: number;
  name: string;
  email?: string;
  contact?: string;
  address?: string;
  postalCode?: string;
  password?: string;
  role: string; // e.g. "prime-admin", "basic-admin", "client", "labor", etc.
  photo?: string;

  // Client-specific fields
  estimateNumber?: string;
  projectType?: string;

  // Labor/Subcontractor specific fields
  type?: "Labor" | "SubContractor" | "Material";
  rate?: number;
  quantity?: number;
  date?: string;
  vatRate?: number;
  description?: string;

  // uploadedFile in your original example is a URL string here:
  uploadedFile?: string | UploadFile;
}

interface UserApiResponse {
  success: boolean;
  message: string;
  data: User[];
}

import { baseApi } from "../../app/api/baseApi";
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 👇 This is the part you need to modify

    getAllUsers: builder.query<UserApiResponse, void>({
      query: () => "/users",
      transformResponse: (response: any) => {
        return response;
      },
      providesTags: ["Users"],
    }),

    getUserById: builder.query({
      query: (id: string | number) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),
    createClient: builder.mutation({
      query: (userData) => ({
        url: "/users/create-client",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    createPrimeAdmin: builder.mutation({
      query: (userData) => ({
        url: "/users/create-prime-admin",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    createBasicAdmin: builder.mutation({
      query: (userData) => ({
        url: "/users/create-basic-admin",
        method: "POST",
        body: userData,
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


    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
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
  useCreateClientMutation,
  useCreatePrimeAdminMutation,
  useCreateBasicAdminMutation,
  useCreateLaborUserMutation,      
  useUpdateLaborUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
