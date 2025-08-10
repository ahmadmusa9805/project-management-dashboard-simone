import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

import userReducer from "../features/users/usersSlice";
import earningsReducer from "../features/projects/dashbordSlice";
import documentReducer from "../features/projects/project/shared/documentSlice";
import paymentReducer from "../features/payments/paymentSlice";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [baseApi.reducerPath]: baseApi.reducer,
 

    // Normal Slices
    auth: authReducer,
    user: userReducer,
    earnings: earningsReducer,
    document: documentReducer,
    payment: paymentReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
