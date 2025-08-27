// reportApi.ts
// Adjust import path as needed

import { baseApi } from "../../../../app/api/baseApi";

export interface SiteReport {
  _id: string;
  projectId: string;
  title: string;
  date: string;
  overviewText: string;
  overviewFile?: string[];
  weather?: string[];
  workingDays?: string[];
  LaborTeam?: string[];
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SiteReportsApiResponse {
  data: SiteReport[];
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  success: boolean;
}

export interface CreateSiteReportRequest {
  projectId: string;
  title: string;
  date: string;
  overviewText: string;
  overviewFile?: File[];
  weather?: File[];
  workingDays?: File[];
  LaborTeam?: File[];
}

export interface UpdateSiteReportRequest {
  title?: string;
  date?: string;
  overviewText?: string;
  overviewFile?: File[];
  weather?: File[];
  workingDays?: File[];
  LaborTeam?: File[];
}

export const reportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSiteReport: build.mutation<SiteReport, FormData>({
      query: (formData) => ({
        url: "/site-reports/create-site-report",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["SiteReports"],
    }),

    getSiteReports: build.query<SiteReport[], string>({
      query: (projectId) => ({
        url: `/site-reports?projectId=${projectId}`,
        method: "GET",
      }),
      transformResponse: (response: SiteReportsApiResponse) => response.data,
      providesTags: ["SiteReports"],
    }),

    getSingleSiteReport: build.query<SiteReport, string>({
      query: (id) => ({
        url: `/site-reports/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: SiteReport }) => response.data,
      providesTags: ["SiteReports"],
    }),

    updateSiteReport: build.mutation<
      SiteReport,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/site-reports/${id}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["SiteReports"],
    }),

    deleteSiteReport: build.mutation<void, string>({
      query: (id) => ({
        url: `/site-reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SiteReports"],
    }),

    shareSiteReport: build.mutation<void, string>({
      query: (id) => ({
        url: `/site-reports/${id}/share`,
        method: "POST",
      }),
      invalidatesTags: ["SiteReports"],
    }),

    unshareSiteReport: build.mutation<void, string>({
      query: (id) => ({
        url: `/site-reports/${id}/unshare`,
        method: "POST",
      }),
      invalidatesTags: ["SiteReports"],
    }),
  }),
});

export const {
  useCreateSiteReportMutation,
  useGetSiteReportsQuery,
  useGetSingleSiteReportQuery,
  useUpdateSiteReportMutation,
  useDeleteSiteReportMutation,
  useShareSiteReportMutation,
  useUnshareSiteReportMutation,
} = reportApi;
