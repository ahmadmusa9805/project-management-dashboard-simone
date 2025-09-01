import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, User } from "./auth.types";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userEmail: string;
  role: "superAdmin" | "primeAdmin" | "basicAdmin" | "client";
  iat: number;
  exp: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { accessToken } = action.payload;
      state.token = accessToken;

      try {
        const decoded = jwtDecode<JwtPayload>(accessToken);
        console.log("Decoded JWT:", decoded);
        state.user = { email: decoded.userEmail, role: decoded.role };
      } catch {
        state.user = null;
      }
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
    },
    rehydrateUserFromToken: (state) => {
      if (state.token) {
        try {
          const decoded = jwtDecode<JwtPayload>(state.token);
          state.user = { email: decoded.userEmail, role: decoded.role };
        } catch {
          state.user = null; // invalid/expired token in storage
          state.token = null;
        }
      }
    },
  },
});

export const { setCredentials, clearCredentials, rehydrateUserFromToken } =
  authSlice.actions;
export default authSlice.reducer;
