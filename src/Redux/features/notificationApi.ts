import { baseApi } from "../app/api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get unread notifications
    getUnreadNotifications: builder.query({
      query: () => "/notifications/unread",
      providesTags: ["Notifications"], // Tag to invalidate
    }),

    // ✅ Create a notification
    createNotification: builder.mutation({
      query: (data) => ({
        url: "/notifications/create-Notification",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"], // Refetch after creation
    }),

    // ✅ Mark all notifications as read
    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/mark-all-as-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"], // Refetch after marking
    }),

    // ✅ Mark a single notification as read
    markNotificationAsRead: builder.mutation({
      query: (id: string) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"], // Refetch after marking
    }),
  }),
});

export const {
  useCreateNotificationMutation,
  useGetUnreadNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkNotificationAsReadMutation,
} = notificationApi;
