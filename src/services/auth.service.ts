import { http, tokenStorage } from './http';
import type { ApiResponse, LoginRequest, LoginResponse, SafeUser } from '../types/api';

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await http.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    const result = data.data!;
    tokenStorage.set(result.token);
    return result;
  },

  async me() {
    const { data } = await http.get<ApiResponse<{ user: SafeUser }>>('/auth/me');
    return data.data!.user;
  },

  logout() {
    tokenStorage.clear();
  },
};
