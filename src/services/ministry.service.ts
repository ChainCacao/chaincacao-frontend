import { http } from './http';
import type { ApiResponse } from '../types/api';

export const ministryService = {
  async validateRegistration(payload: unknown) {
    const { data } = await http.post<ApiResponse<unknown>>('/ministry/registrations/validate', payload);
    return data.data;
  },

  async registerAgent(payload: unknown, setupKey?: string) {
    const { data } = await http.post<ApiResponse<unknown>>('/ministry/agents', payload, {
      headers: setupKey ? { 'x-ministry-setup-key': setupKey } : undefined,
    });
    return data.data;
  },
};
