import { api } from './api';
import { ILoginPayload, IRegisterPayload, IAuthResponse } from '../types/auth.types';
import { ApiResponse } from '../types/api.types';
import { useAuthStore } from '../store/authStore';

export const authService = {
  login: async (payload: ILoginPayload) => {
    const response = await api.post<ApiResponse<IAuthResponse>>('/auth/login', payload);
    const { user, token } = response.data.data;
    useAuthStore.getState().login(user, token);
    return response.data;
  },
  register: async (payload: IRegisterPayload) => {
    const response = await api.post<ApiResponse<IAuthResponse>>('/auth/register', payload);
    return response.data;
  },
  logout: () => {
    useAuthStore.getState().logout();
  }
};
