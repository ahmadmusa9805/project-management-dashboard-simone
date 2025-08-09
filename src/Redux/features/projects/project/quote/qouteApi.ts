/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const quoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuotes: builder.query<any[], string | undefined>({
      query: (projectId) => `/quotes?projectId=${projectId}`,
      providesTags: ["Quotes"],
      transformResponse: (response: { status: string; data: any[] }) => {
        return Array.isArray(response.data) ? response.data : [];
      },
    }),

    getSingleQuote: builder.query<any, string>({
      query: (id) => `/quotes/${id}`,
      providesTags: ["Quotes"],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    createQuote: builder.mutation<any, any>({
      query: (data) => {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append(
          "data",
          JSON.stringify({
            title: data.title,
            projectId: data.projectId,
            value: data.amount,
          })
        );
        return {
          url: "/quotes/create-quote",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Quotes"],
    }),

    updateQuote: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append(
          "data",
          JSON.stringify({
            title: data.title,
            projectId: data.projectId,
            value: data.amount,
          })
        );
        return {
          url: `/quotes/${id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Quotes"],
    }),

    deleteQuote: builder.mutation<any, string>({
      query: (id) => ({
        url: `/quotes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quotes"],
    }),

    shareQuote: builder.mutation<any, { id: string; sharedWith: string[] }>({
      query: ({ id, sharedWith }) => ({
        url: `/quotes/${id}/share`,
        method: "POST",
        body: { sharedWith },
      }),
      invalidatesTags: ["Quotes"],
    }),

    unShareQuote: builder.mutation<any, { id: string; unShareWith: string[] }>({
      query: ({ id, unShareWith }) => ({
        url: `/quotes/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["Quotes"],
    }),
  }),
});

export const {
  useGetAllQuotesQuery,
  useGetSingleQuoteQuery,
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
  useShareQuoteMutation,
  useUnShareQuoteMutation,
} = quoteApi;
