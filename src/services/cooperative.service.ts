import { http } from './http';
import type { Agriculteur, ApiResponse } from '../types/api';

export const cooperativeService = {
  async listAgriculteurs() {
    const { data } = await http.get<ApiResponse<{ agriculteurs: Agriculteur[] }>>('/cooperative/agriculteurs');
    return data.data!.agriculteurs;
  },

  async createAgriculteur(payload: unknown) {
    const { data } = await http.post<ApiResponse<unknown>>('/cooperative/agriculteurs', payload);
    return data.data;
  },
};
