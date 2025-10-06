import { baseApi } from "../../app/api/baseApi";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get single project analytics by project ID
    getSingleProjectAnalytics: builder.query({
      query: (id: string) => `/analytics/single-project-analytics/${id}`,
    }),

    // Get combined analytics of all projects
    getAllAnalyticsCombined: builder.query({
      query: () => "/analytics/get-all-analytics-combined",
    }),

    // Get analytics profit by period (dynamic month)
    getAnalyticsProfitByPeriod: builder.query({
      query: (month: number) =>
        `/analytics/get-analytics-profit-by-period?month=${month}`,
    }),
  }),
});

export const {
  useGetSingleProjectAnalyticsQuery,
  useGetAllAnalyticsCombinedQuery,
  useGetAnalyticsProfitByPeriodQuery,
} = analyticsApi;
