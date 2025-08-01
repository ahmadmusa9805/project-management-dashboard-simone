export interface LoginPayload {
  email: string;
  password: string;
}

// Only accessToken is received, no user object
export interface AuthResponse {
  accessToken: string;
}

// This must be extracted from the token
export interface User {
  email: string;
  role: "superAdmin" | "primeAdmin" | "basicAdmin" | "client";
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
