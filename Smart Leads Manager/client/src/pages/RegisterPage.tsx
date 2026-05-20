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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      navigate('/login');
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
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-xl bg-accent items-center justify-center text-white font-extrabold text-2xl mb-3 shadow-lg shadow-purple-500/20">
            GF
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight text-center">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm text-center">Join us to manage your gigs and workflow</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
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
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" className="w-full mt-2 py-2.5 rounded-xl shadow-lg shadow-purple-500/10" isLoading={isLoading}>
            Register
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-semibold transition-colors duration-150">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
