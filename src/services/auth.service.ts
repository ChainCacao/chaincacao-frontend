import { http, tokenStorage } from './http';
import type { ApiResponse, LoginRequest, LoginResponse, User } from '../types/api';

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await http.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    tokenStorage.set(data.data.token);
    return data.data;
  },

  async me() {
    const { data } = await http.get<ApiResponse<{ user: User }>>('/auth/me');
    return data.data.user;
  },

  logout() {
    tokenStorage.clear();
  },
};
