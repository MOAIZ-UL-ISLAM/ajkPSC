'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/features/auth/authSlice';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-2xl">Dashboard</h2>
              <button 
                onClick={handleLogout}
                className="btn btn-primary"
              >
                Logout
              </button>
            </div>
            <div className="divider"></div>
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-2">Welcome back!</h3>
              <p className="text-gray-600">You are logged in as: {user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}