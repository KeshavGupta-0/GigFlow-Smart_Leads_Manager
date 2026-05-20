import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      navigate('/');
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative transition-colors duration-300">
      {/* Floating Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-3 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-100 dark:border-slate-700"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
      </button>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800 transition-all duration-300 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-accent items-center justify-center text-white font-extrabold text-2xl mb-4 shadow-lg shadow-purple-500/20">
            GF
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Sign in to manage your gigs and workflow</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" className="w-full mt-2 py-2.5 rounded-xl shadow-lg shadow-purple-500/10" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-semibold transition-colors duration-150">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
