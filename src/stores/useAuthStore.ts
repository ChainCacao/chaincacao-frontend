import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { tokenStorage } from '../services/http';
import type { LoginResponse, SafeUser } from '../types/api';

interface UserState {
  user: SafeUser | null;
  token: string | null;
  walletAddress: string | null;
  isWalletConnected: boolean;
  notifications: number;
  login: (session: LoginResponse | SafeUser | Record<string, unknown>) => void;
  logout: () => void;
  setWallet: (address: string) => void;
}

export const useAuthStore = create<UserState>((set) => ({
  user: null,
  token: tokenStorage.get(),
  walletAddress: null,
  isWalletConnected: false,
  notifications: 0,
  login: (session) => {
    if ('token' in session && typeof session.token === 'string' && 'user' in session) {
      tokenStorage.set(session.token);
      set({ user: session.user as SafeUser, token: session.token });
      return;
    }
    set({ user: session as SafeUser });
  },
  logout: () => {
    authService.logout();
    set({ user: null, token: null, walletAddress: null, isWalletConnected: false });
  },
  setWallet: (address) => set({ walletAddress: address, isWalletConnected: !!address }),
}));
