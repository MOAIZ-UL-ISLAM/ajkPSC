import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, setError } from '@/store/features/auth/authSlice';
import { registerSchema } from '@/lib/validators';
import Link from 'next/link';
import { z } from 'zod';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const { mutate: registerUser, isLoading } = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      dispatch(setCredentials({ 
        user: { email: data.email }, 
        token: data.token 
      }));
      reset();
      router.push('/dashboard');
    },
    onError: (error: any) => {
      dispatch(setError(error.response?.data?.message || 'Registration failed'));
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold">Register</h2>
          
          <form onSubmit={handleSubmit((data) => registerUser(data))}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">CNIC</span>
              </label>
              <input
                type="text"
                {...register('cnic')}
                className={`input input-bordered ${errors.cnic ? 'input-error' : ''}`}
                placeholder="13-digit CNIC number"
              />
              {errors.cnic && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.cnic.message}</span>
                </label>
              )}
            </div>

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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Confirm your password"
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
                Register
              </button>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
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