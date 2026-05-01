import { create } from 'zustand';

interface UserState {
  user: any | null;
  walletAddress: string | null;
  isWalletConnected: boolean;
  notifications: number;
  login: (userData: any) => void;
  setWallet: (address: string) => void;
}

export const useAuthStore = create<UserState>((set) => ({
  user: null,
  walletAddress: null,
  isWalletConnected: false,
  notifications: 2, // Mock initial pour la démo
  login: (userData) => set({ user: userData }),
  setWallet: (address) => set({ walletAddress: address, isWalletConnected: !!address }),
}));