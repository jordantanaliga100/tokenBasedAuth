import { createContext } from "react";
import { type User } from "../../types/User";

export interface RegisterData {
  username: string;
  email: string; // ✨ Idagdag 'to
  password: string;
}

// ✨ LOGIN: Kadalasan username/email at password lang
export interface LoginData {
  email: string; // O kaya email depende sa backend mo
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isVerifying: boolean;
  error: string | null;
  register: (userData: RegisterData) => Promise<void>;
  login: (userData: LoginData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  requestVerification: () => void;
  verifyEmail: (otp: string) => void;
  successMessage: string | null;
  sendPasswordResetEmail: (email: string) => Promise<string>;
  resetPassword: (email: string, token: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);
