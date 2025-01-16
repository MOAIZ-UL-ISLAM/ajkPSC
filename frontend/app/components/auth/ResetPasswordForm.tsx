import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAppDispatch } from '@/store/hooks';
import { setError } from '@/store/features/auth/authSlice';
import { resetPasswordSchema } from '@/lib/validators';
import Link from 'next/link';
import { z } from 'zod';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const { mutate: resetPassword, isLoading } = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      reset();
      router.push('/login');
    },
    onError: (error: any) => {
      dispatch(setError(error.response?.data?.message || 'Failed to reset password'));
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">Reset Password</h2>
          
          <form onSubmit={handleSubmit((data) => resetPassword(data))}>
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
                <span className="label-text">OTP</span>
              </label>
              <input
                type="text"
                {...register('otp')}
                className={`input input-bordered ${errors.otp ? 'input-error' : ''}`}
                placeholder="Enter 6-digit OTP"
              />
              {errors.otp && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.otp.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                {...register('newPassword')}
                className={`input input-bordered ${errors.newPassword ? 'input-error' : ''}`}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.newPassword.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.confirmPassword.message}</span>
                </label>
              )}
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}