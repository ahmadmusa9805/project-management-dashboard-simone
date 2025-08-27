import { baseApi } from "../../../../app/api/baseApi";


const handoverCombineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create handover combine
    createHandoverCombine: builder.mutation({
      query: (handoverCombineData) => ({
        url: '/handover-combines/create-handover-combine',
        method: 'POST',
        body: handoverCombineData,
      }),
      invalidatesTags: ['HandoverCombine'],
    }),

    // Get all handover combines
    getAllHandoverCombines: builder.query({
      query: (params) => ({
        url: '/handover-combines',
        method: 'GET',
        params,
      }),
      providesTags: ['HandoverCombine'],
    }),

    // Get single handover combine
    getSingleHandoverCombine: builder.query({
      query: (id) => ({
        url: `/handover-combines/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'HandoverCombine', id }],
    }),

    // Update handover combine
    updateHandoverCombine: builder.mutation({
      query: ({ id, ...handoverCombineData }) => ({
        url: `/handover-combines/${id}`,
        method: 'PATCH',
        body: handoverCombineData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'HandoverCombine', id },
        'HandoverCombine',
      ],
    }),

    // Delete handover combine
    deleteHandoverCombine: builder.mutation({
      query: (id) => ({
        url: `/handover-combines/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HandoverCombine'],
    }),

    // Share handover combine
    shareHandoverCombine: builder.mutation({
      query: ({ id, sharedWith }) => ({
        url: `/handover-combines/${id}/share`,
        method: 'POST',
        body: { sharedWith },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'HandoverCombine', id },
        'HandoverCombine',
      ],
    }),

    // Unshare handover combine
    unShareHandoverCombine: builder.mutation({
      query: ({ id, unShareWith }) => ({
        url: `/handover-combines/${id}/unshare`,
        method: 'POST',
        body: { unShareWith },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'HandoverCombine', id },
        'HandoverCombine',
      ],
    }),

    // Get all handover combines data
    getAllHandoverCombinesData: builder.query({
      query: ({ id, ...params }) => ({
        url: `/handover-combines/${id}/combine-data`,
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: 'HandoverCombine', id }],
    }),
  }),
});

export const {
  useCreateHandoverCombineMutation,
  useGetAllHandoverCombinesQuery,
  useGetSingleHandoverCombineQuery,
  useUpdateHandoverCombineMutation,
  useDeleteHandoverCombineMutation,
  useShareHandoverCombineMutation,
  useUnShareHandoverCombineMutation,
  useGetAllHandoverCombinesDataQuery,
} = handoverCombineApi;

export default handoverCombineApi;