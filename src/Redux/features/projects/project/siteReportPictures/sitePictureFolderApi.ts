/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const sitePictureFolderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All SitePictureFolders (Static + Custom DB)
    getAllSitePictureFolders: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/site-pictures${queryString}`;
      },
      providesTags: ["SitePictureFolders"],
      transformResponse: (response: {
        status: string;
        data: any[];
        meta?: any;
      }) => {
        // Merge static + DB folders
        const dbFolders = Array.isArray(response.data) ? response.data : [];
        return {
          data: [...dbFolders],
          meta: response.meta,
        };
      },
    }),

    // ✅ Get Single SitePictureFolder (DB only)
    getSingleSitePictureFolder: builder.query<any, string>({
      query: (id) => `/site-pictures/${id}`,
      providesTags: ["SitePictureFolders"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create SitePictureFolder (DB custom only)
    createSitePictureFolder: builder.mutation<any, any>({
      query: (data) => ({
        url: "/site-pictures/create-site-picture",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SitePictureFolders"],
    }),

    // ✅ Update SitePictureFolder
    updateSitePictureFolder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/site-pictures/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SitePictureFolders"],
    }),

    // ✅ Delete SitePictureFolder
    deleteSitePictureFolder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/site-pictures/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SitePictureFolders"],
    }),

    // ✅ Share SitePictureFolder
    shareSitePictureFolder: builder.mutation<
      any,
      { id: string; shareWith: any[] }
    >({
      query: ({ id, shareWith }) => ({
        url: `/site-pictures/${id}/share`,
        method: "POST",
        body: shareWith,
      }),
      invalidatesTags: ["SitePictureFolders"],
    }),

    // ✅ Unshare SitePictureFolder
    unshareSitePictureFolder: builder.mutation<
      any,
      { id: string; unShareWith: any[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/site-pictures/${id}/unshare`,
        method: "POST",
        body: unShareWith,
      }),
      invalidatesTags: ["SitePictureFolders"],
    }),
  }),
});

export const {
  useGetAllSitePictureFoldersQuery,
  useGetSingleSitePictureFolderQuery,
  useCreateSitePictureFolderMutation,
  useUpdateSitePictureFolderMutation,
  useDeleteSitePictureFolderMutation,
  useShareSitePictureFolderMutation,
  useUnshareSitePictureFolderMutation,
} = sitePictureFolderApi;
