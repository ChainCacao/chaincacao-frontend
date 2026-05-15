import { http } from './http';
import type {
  ApiResponse,
  CertifyLotRequest,
  CreateLotRequest,
  LotActionRequest,
  LotMutationResponse,
  LotRecolte,
  MergeLotsRequest,
  ReceiveLotRequest,
  TransferLotRequest,
} from '../types/api';

export type ListLotsQuery = {
  statutTrajet?: string;
  filiere?: string;
  agriculteurId?: string;
  cooperativeId?: string;
  limit?: number;
};

export const lotService = {
  async list(query: ListLotsQuery = {}) {
    const { data } = await http.get<ApiResponse<{ lots: LotRecolte[] }>>('/lots', { params: query });
    return data.data.lots;
  },

  async get(id: string) {
    const { data } = await http.get<ApiResponse<{ lot: LotRecolte }>>(`/lots/${id}`);
    return data.data.lot;
  },

  async verify(codeLot: string) {
    const { data } = await http.get<ApiResponse<{ lot: LotRecolte }>>(`/lots/verify/${encodeURIComponent(codeLot)}`);
    return data.data.lot;
  },

  async create(payload: CreateLotRequest) {
    const { data } = await http.post<ApiResponse<LotMutationResponse>>('/lots', payload);
    return data.data;
  },

  async merge(payload: MergeLotsRequest) {
    const { data } = await http.post<ApiResponse<LotMutationResponse>>('/lots/merge', payload);
    return data.data;
  },

  async transfer(payload: TransferLotRequest) {
    const { data } = await http.post<ApiResponse<LotMutationResponse>>('/lots/transfer', payload);
    return data.data;
  },

  async receive(payload: ReceiveLotRequest) {
    const { data } = await http.post<ApiResponse<LotMutationResponse>>('/lots/receive', payload);
    return data.data;
  },

  async addAction(payload: LotActionRequest) {
    const { data } = await http.post<ApiResponse<LotMutationResponse>>('/lots/actions', payload);
    return data.data;
  },

  async certify(payload: CertifyLotRequest) {
    const { data } = await http.post<ApiResponse<LotMutationResponse>>('/lots/certification', payload);
    return data.data;
  },
};
