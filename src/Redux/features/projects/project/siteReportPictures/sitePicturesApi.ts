/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const sitePictureImageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All SitePictureImages
    getAllSitePictureImages: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/site-picture-images${queryString}`;
      },
      providesTags: ["SitePictureImages"],
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

    // ✅ Get Single SitePictureImage
    getSingleSitePictureImage: builder.query<any, string>({
      query: (id) => `/site-picture-images/${id}`,
      providesTags: ["SitePictureImages"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create SitePictureImage (with file upload)
    createSitePictureImage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/site-picture-images/create-site-picture-image",
        method: "POST",
        body: formData,
        // Important: Don't set Content-Type header for FormData
        // The browser will set it automatically with the correct boundary
      }),
      invalidatesTags: ["SitePictureImages"],
    }),

    // ✅ Update SitePictureImage (with file upload)
    // updateSitePictureImage: builder.mutation<
    //   any,
    //   { id: string; data: FormData }
    // >({
    //   query: ({ id, data }) => ({
    //     url: `/site-picture-images/${id}`,
    //     method: "PATCH",
    //     body: data,
    //     // Important: Don't set Content-Type header for FormData
    //   }),
    //   invalidatesTags: ["SitePictureImages"],
    // }),

    updateSitePictureImage: builder.mutation<
      any,
      { id: string; data: FormData } // Define the data type
    >({
      query: ({ id, data }) => ({
        url: `/site-picture-images/${id}`,
        method: "PATCH",
        body: data, // This will send a JSON payload
      }),
      invalidatesTags: ["SitePictureImages"],
    }),

    // ✅ Delete SitePictureImage
    deleteSitePictureImage: builder.mutation<any, string>({
      query: (id) => ({
        url: `/site-picture-images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SitePictureImages"],
    }),
  }),
});

export const {
  useGetAllSitePictureImagesQuery,
  useGetSingleSitePictureImageQuery,
  useCreateSitePictureImageMutation,
  useUpdateSitePictureImageMutation,
  useDeleteSitePictureImageMutation,
} = sitePictureImageApi;
