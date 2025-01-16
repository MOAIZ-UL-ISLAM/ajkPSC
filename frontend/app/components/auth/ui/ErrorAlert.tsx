'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearError } from '@/store/features/auth/authSlice';

export default function ErrorAlert() {
  const error = useAppSelector((state: { auth: { error: any; }; }) => state.auth.error);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  if (!error) return null;

  return (
    <div className="toast toast-end">
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    </div>
  );
}
