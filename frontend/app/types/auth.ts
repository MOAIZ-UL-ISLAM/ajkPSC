export interface RegisterData {
  cnic: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthState {
  user: null | { email: string };
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
