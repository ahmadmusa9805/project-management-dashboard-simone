import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import authReducer from '../features/auth/authSlice';
import { baseApi } from './api/baseApi';
import userReducer from '../features/users/usersSlice'
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
     auth: authReducer,
     [baseApi.reducerPath]: baseApi.reducer,
     user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
