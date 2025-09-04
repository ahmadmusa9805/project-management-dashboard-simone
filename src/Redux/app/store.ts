import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/usersSlice";
import earningsReducer from "../features/projects/dashbordSlice";
import documentReducer from "../features/projects/project/shared/documentSlice";
import paymentReducer from "../features/payments/paymentSlice";
import { baseApi } from "./api/baseApi";

// ✅ Persist ONLY the auth slice, and ONLY the token key
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"], // persist token; user will be rebuilt from token
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,

    // ✅ use persisted auth slice
    auth: persistedAuthReducer,

    user: userReducer,
    earnings: earningsReducer,
    document: documentReducer,
    payment: paymentReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
