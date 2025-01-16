'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { LoginData } from '@/types/auth';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, setError } from '@/store/features/auth/authSlice';
import { loginSchema } from '@/lib/validators';
import Link from 'next/link';
import { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (data) => {
      // Clear any existing errors
      setErrorMessage(null);
      
      dispatch(setCredentials({ 
        user: { email: data.email }, 
        token: data.token 
      }));
      reset();
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      // Set the error message for display
      setErrorMessage(error.message || 'Login failed. Please try again.');
      dispatch(setError(error.message || 'Login failed'));
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null); // Clear any existing errors
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 background-mesh ">
        <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">Login</h2>
          
          {errorMessage && (
            <div className="alert alert-error">
              <span>{errorMessage}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register('email')}
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                {...register('password')}
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="link link-primary">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${mutation.isPending ? 'loading' : ''}`}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="link link-primary">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}