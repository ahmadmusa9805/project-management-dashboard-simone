import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthResponse ,LoginPayload} from './auth.types';


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://350c6bd4-4a04-4d89-bf9d-1f835ff83bd4.mock.pstmn.io' }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
        
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
