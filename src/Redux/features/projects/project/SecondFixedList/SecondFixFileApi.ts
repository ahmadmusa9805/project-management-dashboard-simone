/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const secondFixFileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All SecondFixFiles
    getAllSecondFixFiles: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/second-fix-files${queryString}`;
      },
      providesTags: ["SecondFixFiles"],
      transformResponse: (response: {
        status: string;
        data: any[];
        meta?: any;
      }) => ({
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta,
      }),
    }),

    // ✅ Get Single SecondFixFile
    getSingleSecondFixFile: builder.query<any, string>({
      query: (id) => `/second-fix-files/${id}`,
      providesTags: ["SecondFixFiles"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create SecondFixFile
    createSecondFixFile: builder.mutation<any, any>({
      query: (data) => {
        const formData = new FormData();
        if (data.file) formData.append("file", data.file);

        const requestData = {
          title: data.title,
          room: data.room,
          surface: data.surface,
          productCode: data.productCode,
          suplierName: data.suplierName,
          text: data.text,
          secondFixSubFolder: data.secondFixSubFolder,
          projectId: data.projectId,
          isDeleted: data.isDeleted || false,
        };

        formData.append("data", JSON.stringify(requestData));

        return {
          url: "/second-fix-files/create-second-fix-file",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["SecondFixFiles"],
    }),

    // ✅ Update SecondFixFile
    updateSecondFixFile: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.file) formData.append("file", data.file);

        formData.append(
          "data",
          JSON.stringify({
            title: data.title,
            room: data.room,
            surface: data.surface,
            productCode: data.productCode,
            suplierName: data.suplierName,
            text: data.text,
            secondFixSubFolder: data.secondFixSubFolder,
            projectId: data.projectId,
            isDeleted: data.isDeleted,
          })
        );

        return {
          url: `/second-fix-files/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["SecondFixFiles"],
    }),

    // ✅ Delete SecondFixFile
    deleteSecondFixFile: builder.mutation<any, string>({
      query: (id) => ({
        url: `/second-fix-files/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SecondFixFiles"],
    }),

    // ✅ Share SecondFixFile
    shareSecondFixFile: builder.mutation<
      any,
      { id: string; sharedWith: any[] }
    >({
      query: ({ id, sharedWith }) => ({
        url: `/second-fix-files/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: ["SecondFixFiles"],
    }),

    // ✅ Unshare SecondFixFile
    unShareSecondFixFile: builder.mutation<
      any,
      { id: string; unShareWith: any[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/second-fix-files/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["SecondFixFiles"],
    }),
  }),
});

export const {
  useGetAllSecondFixFilesQuery,
  useGetSingleSecondFixFileQuery,
  useCreateSecondFixFileMutation,
  useUpdateSecondFixFileMutation,
  useDeleteSecondFixFileMutation,
  useShareSecondFixFileMutation,
  useUnShareSecondFixFileMutation,
} = secondFixFileApi;
