import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, AuthState, User } from "./auth.types";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

interface JwtPayload {
  userEmail: string;
  role: "superAdmin" | "primeAdmin" | "basicAdmin" | "client";
  iat: number;
  exp: number;
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

      const decoded = jwtDecode<JwtPayload>(accessToken);
      console.log("🔍 Decoded JWT Payload:", decoded);
      // ✅ Correct usage
      const user: User = {
        email: decoded.userEmail,
        role: decoded.role,
      };
      console.log(user)

      state.token = accessToken;
      state.user = user;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
    },

    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    loadFromStorage: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      }
    },
  },
});

export const { setCredentials, clearCredentials, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
