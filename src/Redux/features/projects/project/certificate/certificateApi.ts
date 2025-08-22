/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const certificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All Certificates
    getAllCertificates: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/certificates${queryString}`;
      },
      providesTags: ["Certificates"],
      transformResponse: (response: {
        status: string;
        data: any[];
        meta?: any;
      }) => {
        return {
          data: Array.isArray(response.data) ? response.data : [],
          meta: response.meta,
        };
      },
    }),

    // ✅ Get Single Certificate
    getSingleCertificate: builder.query<any, string>({
      query: (id) => `/certificates/${id}`,
      providesTags: ["Certificates"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create Certificate
    createCertificate: builder.mutation<any, any>({
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
          })
        );
        return {
          url: "/certificates/create-certificate",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Certificates"],
    }),

    // ✅ Update Certificate
    updateCertificate: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.file) {
          formData.append("file", data.file);
        }
        formData.append(
          "data",
          JSON.stringify({
            projectId: data.projectId,
            title: data.title,
          })
        );
        return {
          url: `/certificates/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Certificates"],
    }),

    // ✅ Delete Certificate
    deleteCertificate: builder.mutation<any, string>({
      query: (id) => ({
        url: `/certificates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Certificates"],
    }),

    // ✅ Share Certificate
    shareCertificate: builder.mutation<any, { id: string; sharedWith: any[] }>({
      query: ({ id, sharedWith }) => ({
        url: `/certificates/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: ["Certificates"],
    }),

    // ✅ Unshare Certificate
    unShareCertificate: builder.mutation<
      any,
      { id: string; unShareWith: any[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/certificates/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["Certificates"],
    }),
  }),
});

export const {
  useGetAllCertificatesQuery,
  useGetSingleCertificateQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
  useShareCertificateMutation,
  useUnShareCertificateMutation,
} = certificateApi;
