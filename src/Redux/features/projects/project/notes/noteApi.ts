// import { baseApi } from "../../../../app/api/baseApi";

// export const noteApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // Get all Notes
//     getAllNotes: builder.query<any[], Record<string, any> | undefined>({
//       query: (params) => {
//         const queryString = new URLSearchParams(params || {}).toString();
//         return `/notes?${queryString}`;
//       },
//       providesTags: ["Notes"],
//       transformResponse: (response: { success: boolean; data: any[] }) =>
//         Array.isArray(response.data) ? response.data : [],
//     }),

//     // Get single Note
//     getSingleNote: builder.query<any, string>({
//       query: (id) => `/notes/${id}`,
//       providesTags: ["Notes"],
//       transformResponse: (response: { success: boolean; data: any }) =>
//         response.data,
//     }),

//     // Create Note
//     createNote: builder.mutation<any, any>({
//       query: (data) => {
//         const formData = new FormData();
//         if (data.file) {
//           formData.append("file", data.file);
//         }
//         formData.append(
//           "data",
//           JSON.stringify({
//             projectId: data.projectId,
//             title: data.title,
//             description: data.description,
//             value: Number(data.value),
//           })
//         );
//         return {
//           url: "/notes/create-note",
//           method: "POST",
//           body: formData,
//         };
//       },
//       invalidatesTags: ["Notes"],
//     }),

//     // Update Note
//     updateNote: builder.mutation<any, { id: string; data: any }>({
//       query: ({ id, data }) => {
//         const formData = new FormData();
//         if (data.file) {
//           formData.append("file", data.file);
//         }
//         formData.append(
//           "data",
//           JSON.stringify({
//             projectId: data.projectId,
//             title: data.title,
//             description: data.description,
//             value: Number(data.value),
//             date: data.date,
//             clientComment: data.clientComment,
//             adminComment: data.adminComment,
//             isDeleted: data.isDeleted ?? false,
//           })
//         );
//         return {
//           url: `/notes/${id}`,
//           method: "PATCH",
//           body: formData,
//         };
//       },
//       invalidatesTags: ["Notes"],
//     }),

//     // Delete Note
//     deleteNote: builder.mutation<any, string>({
//       query: (id) => ({
//         url: `/notes/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Notes"],
//     }),

//     // Share Note
//     shareNote: builder.mutation<any, { id: string; sharedWith: any[] }>({
//       query: ({ id, sharedWith }) => ({
//         url: `/notes/${id}/share`,
//         method: "POST",
//         body: { sharedWith },
//       }),
//       invalidatesTags: ["Notes"],
//     }),

//     // Unshare Note
//     unShareNote: builder.mutation<any, { id: string; unShareWith: any[] }>({
//       query: ({ id, unShareWith }) => ({
//         url: `/notes/${id}/unshare`,
//         method: "POST",
//         body: { unShareWith },
//       }),
//       invalidatesTags: ["Notes"],
//     }),
//   }),
// });

// export const {
//   useGetAllNotesQuery,
//   useGetSingleNoteQuery,
//   useCreateNoteMutation,
//   useUpdateNoteMutation,
//   useDeleteNoteMutation,
//   useShareNoteMutation,
//   useUnShareNoteMutation,
// } = noteApi;
/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../../../../app/api/baseApi";

export const noteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all Notes
    getAllNotes: builder.query<any[], Record<string, any> | undefined>({
      query: (params) => {
        const queryString = new URLSearchParams(params || {}).toString();
        return `/notes?${queryString}`;
      },
      providesTags: ["Notes"],
      transformResponse: (response: { success: boolean; data: any[] }) =>
        Array.isArray(response.data) ? response.data : [],
    }),

    // Get single Note
    getSingleNote: builder.query<any, string>({
      query: (id) => `/notes/${id}`,
      providesTags: ["Notes"],
      transformResponse: (response: { success: boolean; data: any }) =>
        response.data,
    }),

    // Create Note
    createNote: builder.mutation<any, any>({
      query: (data) => {
        const formData = new FormData();
        if (data.file) {
          formData.append("file", data.file);
        }
        formData.append(
          "data",
          JSON.stringify({
            projectId: data.projectId,
            title: data.title,
            description: data.description,
            value: Number(data.value),
          })
        );
        return {
          url: "/notes/create-note",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Notes"],
    }),

    // Update Note
    updateNote: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        console.log("Data:", data);
        // const formData = buildFormData({
        //   file: data.file,
        //   title: data.title,
        //   projectId: data.projectId,
        //   description: data.description,
        //   value: data.value,
        //   date: data.date,
        //   clientComment: data.clientComment,
        //   adminComment: data.adminComment,
        //   status: data.status,
        //   isDeleted: data.isDeleted ?? false,
        // });

        const formData = new FormData();

        // Only append file if it exists and is a File object
        if (data.file && data.file instanceof File) {
          console.log("File:", data.file);
          formData.append("file", data.file);
        }

        formData.append(
          "data",
          JSON.stringify({
            projectId: data.projectId,
            title: data.title,

            description: data.description,
            value: Number(data.value),
            date: data.date,
            clientComment: data.clientComment,
            adminComment: data.adminComment,
            status: data.status,
            isDeleted: data.isDeleted ?? false,
          })
        );

        return {
          url: `/notes/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Notes"],
    }),

    // Delete Note
    deleteNote: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),

    // Share Note
    shareNote: builder.mutation<any, { id: string; sharedWith: any[] }>({
      query: ({ id, sharedWith }) => ({
        url: `/notes/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: ["Notes"],
    }),

    // Unshare Note
    unShareNote: builder.mutation<any, { id: string; unShareWith: any[] }>({
      query: ({ id, unShareWith }) => ({
        url: `/notes/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useGetAllNotesQuery,
  useGetSingleNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useShareNoteMutation,
  useUnShareNoteMutation,
} = noteApi;
