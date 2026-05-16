import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { ApiErrorBody } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const TOKEN_KEY = 'chaincacao.auth.token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (!error.response) {
      toast.error('Erreur reseau. Verifiez votre connexion.');
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response.data?.message || error.message;

    if (status === 401) {
      toast.error('Session expiree. Veuillez vous reconnecter.');
      tokenStorage.clear();
      window.location.href = '/';
    } else if (status === 403) {
      toast.error(`Acces refuse : ${message}`);
    } else if (status >= 500) {
      toast.error('Erreur serveur. Reessayez plus tard.');
    } else if (status >= 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    return body?.message || error.message || 'Erreur API';
  }
  if (error instanceof Error) return error.message;
  return 'Erreur inattendue';
};
