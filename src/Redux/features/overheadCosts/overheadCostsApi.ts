/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../app/api/baseApi";

export const overheadCostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get all OverheadCost
    // Backend: router.get('/', ...)
    getAllOverheadCost: builder.query<any, Record<string, any> | undefined>({
      query: (params) => {
        const queryString = new URLSearchParams(params || {}).toString();
        return `/over-costs?${queryString}`;
      },
      providesTags: ["OverheadCost"],
      // ✅ FIX: Return the whole response so component can access .data and .meta
      transformResponse: (response: {
        success: boolean;
        data: any[];
        meta?: any;
      }) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),

    // 2. Get single OverheadCost
    getSingleOverheadCost: builder.query<any, string>({
      query: (id) => `/over-costs/${id}`,
      providesTags: ["OverheadCost"],
      transformResponse: (response: { success: boolean; data: any }) =>
        response.data,
    }),

    // 3. Get All by Project ID (Added based on your backend)
    // Backend: router.get('/get-all-with-projectid/:id', ...)

    //  getAllOverheadCostByProject: builder.query<
    //       any[],
    //       Record<string, any> | undefined
    //     >({
    //       query: (params) => {
    //         const queryString = new URLSearchParams(params || {}).toString();
    //         return `/over-costs/get-all-with-projectid?${queryString}`;
    //       },
    //       providesTags: ["OverheadCost"],
    //       transformResponse: (response: { success: boolean; data: any[] }) =>
    //         response.data,
    //     }),

    getAllOverheadCostsAllProject: builder.query<number, void>({
      query: () => `/over-costs/get-all-over-cost`,
      providesTags: ["OverheadCost"],
      transformResponse: (response: { success: boolean; data: number }) =>
        response.data,
    }),

    getAllOverheadCostByProject: builder.query<number, string>({
      query: (projectId) => `/over-costs/get-all-with-projectid/${projectId}`,
      providesTags: ["OverheadCost"],
      transformResponse: (response: { success: boolean; data: number }) =>
        response.data,
    }),

    // 4. Create OverheadCost
    // Backend: router.post('/create-over-cost', ...)
    createOverheadCost: builder.mutation<any, any>({
      query: (data) => {
        const formData = new FormData();
        // Append file if it exists
        if (data.file) {
          formData.append("file", data.file);
        }

        // Append data fields matching your Schema/Form
        formData.append(
          "data",
          JSON.stringify({
            name: data.name, // Updated from 'title'
            projectId: data.projectId,
            reference: data.reference, // Added
            description: data.description, // Added
            vat: Number(data.vat), // Added
            value: Number(data.value),
            // Removed 'status' as it wasn't in your TOverCost type or Form
          })
        );

        return {
          url: "/over-costs/create-over-cost", // Matches backend route
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [
        "OverheadCost",
        "ProjectCosts",
        "PaymentTrackers",
        "Projects",
        "Notifications",
      ],
    }),

    // 5. Update OverheadCost
    // Backend: router.patch('/:id', ...)
    updateOverheadCost: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.file) {
          formData.append("file", data.file);
        }

        formData.append(
          "data",
          JSON.stringify({
            name: data.name,
            projectId: data.projectId,
            reference: data.reference,
            description: data.description,
            vat: Number(data.vat),
            value: Number(data.value),
          })
        );

        return {
          url: `/over-costs/${id}`,
          method: "PATCH", // Matches backend router.patch
          body: formData,
        };
      },
      invalidatesTags: [
        "OverheadCost",
        "ProjectCosts",
        "PaymentTrackers",
        "Projects",
      ],
    }),

    // 6. Delete OverheadCost
    // Backend: router.delete('/:id', ...)
    deleteOverheadCost: builder.mutation<any, string>({
      query: (id) => ({
        url: `/over-costs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "OverheadCost",
        "ProjectCosts",
        "PaymentTrackers",
        "Projects",
      ],
    }),

    // 7. Share OverheadCost
    // Backend: router.post('/:id/share', ...)
    shareOverheadCost: builder.mutation<any, { id: string; sharedWith: any[] }>(
      {
        query: ({ id, sharedWith }) => ({
          url: `/over-costs/${id}/share`,
          method: "POST",
          body: { sharedWith },
        }),
        invalidatesTags: ["OverheadCost"],
      }
    ),

    // 8. Unshare OverheadCost
    // Backend: router.post('/:id/unshare', ...)
    unShareOverheadCost: builder.mutation<
      any,
      { id: string; unShareWith: string[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/over-costs/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: ["OverheadCost"],
    }),
  }),
});

export const {
  useGetAllOverheadCostQuery,
  useGetSingleOverheadCostQuery,
  useGetAllOverheadCostByProjectQuery,

  useGetAllOverheadCostsAllProjectQuery,
  useCreateOverheadCostMutation,
  useUpdateOverheadCostMutation,
  useDeleteOverheadCostMutation,
  useShareOverheadCostMutation,
  useUnShareOverheadCostMutation,
} = overheadCostApi;
