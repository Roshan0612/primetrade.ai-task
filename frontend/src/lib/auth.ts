import { apiCall, getToken, removeToken, setToken } from './api';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types';

export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  const response = await apiCall<{ data: LoginResponse; message: string }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  return response.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiCall<{ data: LoginResponse; message: string }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  const loginResponse = response.data;
  setToken(loginResponse.accessToken);
  return loginResponse;
};

export const logout = async (): Promise<void> => {
  try {
    await apiCall('/auth/logout', {
      method: 'POST',
    });
  } finally {
    removeToken();
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
