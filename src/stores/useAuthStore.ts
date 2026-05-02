import { create } from 'zustand';

interface UserState {
  user: any | null;
  walletAddress: string | null;
  isWalletConnected: boolean;
  notifications: number;
  login: (userData: any) => void;
  logout: () => void;
  setWallet: (address: string) => void;
}

export const useAuthStore = create<UserState>((set) => ({
  user: null,
  walletAddress: null,
  isWalletConnected: false,
  notifications: 2, // Mock initial pour la démo
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null, walletAddress: null, isWalletConnected: false }),
  setWallet: (address) => set({ walletAddress: address, isWalletConnected: !!address }),
}));