import { http } from './http';
import type { ApiResponse } from '../types/api';

// ── Types ──────────────────────────────────────────────────────

export interface OnChainVerification {
  exists: boolean;
  statutConformiteEUDR: string;
  statutTrajet: string;
  createdAt: string | null;
}

export interface OffChainLotSummary {
  codeLot: string;
  statutTrajet: string;
  statutConformiteEUDR: string;
  blockchainTxHash: string | null;
  tokenId: string | null;
  createdAt: string;
}

export interface BlockchainVerifyResponse {
  onChain: OnChainVerification | null;
  offChain: OffChainLotSummary | null;
  blockchainConfigured: boolean;
}

export interface OnChainLotData {
  lotId: string;
  cooperativeId: string;
  agriculteurId: string;
  lotParentId: string;
  filiere: string;
  especeVariete: string;
  poidsBrutKg: number;
  poidsNetKg: number;
  nbSacsJute: number;
  tauxHumidite: number;
  statutTrajet: string;
  statutConformiteEUDR: string;
  transformateurId: string;
  exportateurId: string;
  certifieurId: string;
  tokenId: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface JourneyStep {
  historiqueIndex: number;
  etape: string;
  actionType: string;
  action: string;
  acteurNom: string;
  timestamp: string | null;
}

export interface ContractStats {
  lotCount: number;
  historiqueCount: number;
  contractAddress: string;
}

// ── Service ────────────────────────────────────────────────────

export const blockchainService = {
  /**
   * Verify a lot's on-chain compliance (public, no auth)
   */
  async verify(codeLot: string) {
    const { data } = await http.get<ApiResponse<BlockchainVerifyResponse>>(
      `/blockchain/verify/${encodeURIComponent(codeLot)}`
    );
    return data.data!;
  },

  /**
   * Get full lot data from the blockchain
   */
  async getLotOnChain(codeLot: string) {
    const { data } = await http.get<ApiResponse<{ onChain: OnChainLotData | null; blockchainConfigured: boolean }>>(
      `/blockchain/lot/${encodeURIComponent(codeLot)}`
    );
    return data.data!;
  },

  /**
   * Get the full journey history from the blockchain
   */
  async getJourney(codeLot: string, offset = 0, limit = 50) {
    const { data } = await http.get<ApiResponse<{ journey: JourneyStep[] | null; blockchainConfigured: boolean }>>(
      `/blockchain/journey/${encodeURIComponent(codeLot)}`,
      { params: { offset, limit } }
    );
    return data.data!;
  },

  /**
   * Get blockchain contract stats
   */
  async getStats() {
    const { data } = await http.get<ApiResponse<{ stats: ContractStats | null; blockchainConfigured: boolean }>>(
      '/blockchain/stats'
    );
    return data.data!;
  },

  /**
   * Register an actor on the blockchain (Ministry/Admin only)
   */
  async registerActor(payload: { walletAddress: string; actorId: string; role: string }) {
    const { data } = await http.post<ApiResponse<{ result: { txHash: string; onChain: boolean } }>>(
      '/blockchain/register-actor',
      payload
    );
    return data.data!;
  },
};
