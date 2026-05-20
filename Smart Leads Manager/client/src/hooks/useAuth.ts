import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { ILoginPayload, IRegisterPayload } from '../types/auth.types';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (payload: ILoginPayload) => {
    setIsLoading(true);
    try {
      await authService.login(payload);
      toast.success('Logged in successfully');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: IRegisterPayload) => {
    setIsLoading(true);
    try {
      await authService.register(payload);
      toast.success('Registration successful. Please login.');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    toast.success('Logged out successfully');
  };

  return { user, isAuthenticated, isLoading, login, register, logout };
};
