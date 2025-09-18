// src/Redux/features/projects/project/timeSchedule/timeScheduleApi.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../../../app/api/baseApi";

export const timeScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get All TimeSchedules
    getAllTimeSchedules: builder.query<any, Record<string, any> | void>({
      query: (params) => {
        const queryString = params
          ? `?${new URLSearchParams(
              params as Record<string, string>
            ).toString()}`
          : "";
        return `/time-schedules${queryString}`;
      },
      providesTags: ["TimeSchedule"],
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

    // ✅ Get Single TimeSchedule by ID
    getSingleTimeSchedule: builder.query<any, string>({
      query: (id) => `/time-schedules/${id}`,
      providesTags: (_res, _err, id) => [{ type: "TimeSchedule", id }],
      transformResponse: (response: { status: string; data: any }) =>
        response.data,
    }),

    // ✅ Create TimeSchedule (multipart with file + JSON)
    createTimeSchedule: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: "/time-schedules/create-time-schedule",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["TimeSchedule", "Notifications"],
    }),

    // ✅ Update TimeSchedule (multipart if updating file)
    updateTimeSchedule: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => {
        console.log(data);
        return {
          url: `/time-schedules/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["TimeSchedule"],
    }),

    // ✅ Delete TimeSchedule
    deleteTimeSchedule: builder.mutation<any, string>({
      query: (id) => ({
        url: `/time-schedules/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TimeSchedule"],
    }),

    // ✅ Share TimeSchedule
    shareTimeSchedule: builder.mutation<any, { id: string; sharedWith: any[] }>(
      {
        query: ({ id, sharedWith }) => ({
          url: `/time-schedules/${id}/share`,
          method: "POST",
          body: { sharedWith },
        }),
        invalidatesTags: (_res, _err, { id }) => [{ type: "TimeSchedule", id }],
      }
    ),

    // ✅ Unshare TimeSchedule
    unShareTimeSchedule: builder.mutation<
      any,
      { id: string; unShareWith: any[] }
    >({
      query: ({ id, unShareWith }) => ({
        url: `/time-schedules/${id}/unshare`,
        method: "POST",
        body: { unShareWith },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "TimeSchedule", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllTimeSchedulesQuery,
  useGetSingleTimeScheduleQuery,
  useCreateTimeScheduleMutation,
  useUpdateTimeScheduleMutation,
  useDeleteTimeScheduleMutation,
  useShareTimeScheduleMutation,
  useUnShareTimeScheduleMutation,
} = timeScheduleApi;
