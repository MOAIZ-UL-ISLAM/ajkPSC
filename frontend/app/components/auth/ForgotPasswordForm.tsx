import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAppDispatch } from '@/store/hooks';
import { setError } from '@/store/features/auth/authSlice';
import { forgotPasswordSchema } from '@/lib/validators';
import Link from 'next/link';
import { z } from 'zod';
import { useState } from 'react';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const dispatch = useAppDispatch();
  const [emailSent, setEmailSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const { mutate: sendResetEmail, isLoading } = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      setEmailSent(true);
      reset();
    },
    onError: (error: any) => {
      dispatch(setError(error.response?.data?.message || 'Failed to send reset email'));
    },
  });

  if (emailSent) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">Check Your Email</h2>
          <p className="text-center">
            We've sent you an email with a OTP to reset your password.
          </p>
          <div className="mt-4">
            <Link href="/reset-password" className="btn btn-primary w-full">
              Enter OTP
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">Forgot Password</h2>
          
          <form onSubmit={handleSubmit((data) => sendResetEmail(data.email))}>
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

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                Send Reset Email
              </button>
            </div>

            <div className="mt-4 text-center text-sm">
              Remember your password?{' '}
              <Link href="/login" className="link-primary link">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
