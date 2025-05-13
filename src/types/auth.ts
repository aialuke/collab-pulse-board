
import type { User as SupabaseUser, Session, AuthResponse, WeakPassword } from '@supabase/supabase-js';

export type UserRole = 'user' | 'manager' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  hasAcceptedTerms: boolean;
  termsAcceptedAt?: string;
};

export type AuthContextType = {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  acceptTerms: (acceptedTerms: boolean) => Promise<void>;
};

export type SignInFormData = {
  email: string;
  password: string;
};

export type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
