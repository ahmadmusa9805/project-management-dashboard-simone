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
import type { SingleUserResponse, User } from "./users.types";
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getAllUsers: builder.query<UserApiResponse, { status?: string }>({
    //   query: (params) => {
    //     const queryString = params?.status ? `?status=${params.status}` : "";
    //     return `/users${queryString}`;
    //   },
    //   transformResponse: (response: any) => response,
    //   providesTags: ["Users"],
    // }),

    getAllUsers: builder.query<
      {
        data: any[];
        meta: { page: number; limit: number; total: number; totalPage: number };
      },
      {
        status?: string;
        page?: number;
        limit?: number;
        searchTerm?: string;
        role?: string;
      } | void
    >({
      query: ({
        status = "",
        page = 1,
        limit = 10,
        searchTerm = "",
        role = "",
      } = {}) => {
        let qs = `?page=${page}&limit=${limit}`;
        if (status) qs += `&status=${encodeURIComponent(status)}`;
        if (searchTerm) qs += `&searchTerm=${encodeURIComponent(searchTerm)}`;
        if (role) qs += `&role=${encodeURIComponent(role)}`;
        return `/users${qs}`;
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
      providesTags: ["Users"],
    }),
    // getAllPrimeAdmins: builder.query<
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
    //     return `/users${qs}`;
    //   },
    //   transformResponse: (response: {
    //     success: boolean;
    //     message: string;
    //     data: any[];
    //     meta: any;
    //   }) => {
    //     return {
    //       data: Array.isArray(response.data) ? response.data : [],
    //       meta: response.meta || { page: 1, limit: 10, total: 0, totalPage: 1 },
    //     };
    //   },
    //   providesTags: ["Users"],
    // }),
    // getAllBasicAdmins: builder.query<
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
    //     return `/users${qs}`;
    //   },
    //   transformResponse: (response: {
    //     success: boolean;
    //     message: string;
    //     data: any[];
    //     meta: any;
    //   }) => {
    //     return {
    //       data: Array.isArray(response.data) ? response.data : [],
    //       meta: response.meta || { page: 1, limit: 10, total: 0, totalPage: 1 },
    //     };
    //   },
    //   providesTags: ["Users"],
    // }),
    // getAllClients: builder.query<
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
    //     return `/users${qs}`;
    //   },
    //   transformResponse: (response: {
    //     success: boolean;
    //     message: string;
    //     data: any[];
    //     meta: any;
    //   }) => {
    //     return {
    //       data: Array.isArray(response.data) ? response.data : [],
    //       meta: response.meta || { page: 1, limit: 10, total: 0, totalPage: 1 },
    //     };
    //   },
    //   providesTags: ["Users"],
    // }),

    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (res: any) => res.data,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),
    getMeUser: builder.query<User, void>({
      query: () => `/users/me`,
      transformResponse: (response: SingleUserResponse): User => response.data,
      providesTags: (result) =>
        result ? [{ type: "Users", id: result._id }, "Me"] : ["Me"],
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: "/users/create-user",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users", "Notifications"],
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
