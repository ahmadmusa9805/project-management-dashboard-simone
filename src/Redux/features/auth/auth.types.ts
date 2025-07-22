export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'super-admin' | 'prime-admin' | 'basic-admin' | 'client';
  };
}
