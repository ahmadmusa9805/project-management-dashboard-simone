/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const paymentTrackerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===== Create Payment Tracker =====
    createPaymentTracker: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: "/payment-trackers/create-payment-tracker",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PaymentTrackers"],
    }),

    // ===== Get All Payment Tracker Elements =====
    getAllPaymentTrackerElements: builder.query<
      any,
      Record<string, any> | void
    >({
      query: (params) => {
        const queryString = new URLSearchParams(params || {}).toString();
        return `/payment-trackers/all-element?${queryString}`;
      },
      providesTags: ["PaymentTrackers"],
      transformResponse: (response: { success: boolean; data: any }) =>
        response.data, // return the object instead of []
    }),
    // ===== Get All Payment Trackers =====
    getAllPaymentTrackers: builder.query<
      any[],
      Record<string, any> | undefined
    >({
      query: (params) => {
        const queryString = new URLSearchParams(params || {}).toString();
        return `/payment-trackers?${queryString}`;
      },
      providesTags: ["PaymentTrackers"],
      transformResponse: (response: { success: boolean; data: any[] }) =>
        response.data,
    }),

    // ===== Get Single Payment Tracker by ID =====
    getSinglePaymentTracker: builder.query<any, string>({
      query: (id) => `/payment-trackers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "PaymentTrackers", id }],
    }),

    // ===== Update Payment Tracker =====
    updatePaymentTracker: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/payment-trackers/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PaymentTrackers", id },
        "PaymentTrackers",
      ],
    }),

    // ===== Delete Payment Tracker =====
    deletePaymentTracker: builder.mutation<any, string>({
      query: (id) => ({
        url: `/payment-trackers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "PaymentTrackers", id },
        "PaymentTrackers",
      ],
    }),
  }),
});

export const {
  useCreatePaymentTrackerMutation,
  useGetAllPaymentTrackerElementsQuery,
  useGetAllPaymentTrackersQuery,
  useGetSinglePaymentTrackerQuery,
  useUpdatePaymentTrackerMutation,
  useDeletePaymentTrackerMutation,
} = paymentTrackerApi;
