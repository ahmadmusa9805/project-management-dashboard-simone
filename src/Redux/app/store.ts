import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import authReducer from "../features/auth/authSlice";
import { baseApi } from "./api/baseApi";
import userReducer from "../features/users/usersSlice";
import earningsReducer from "../features/projects/dashbordSlice";
import documentReducer from "../features/projects/project/shared/documentSlice";
import paymentReducer from "../features/payments/paymentSlice";
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    user: userReducer,
    earnings: earningsReducer,
    document: documentReducer,
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(baseApi.middleware), // combine both middlewares here
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
