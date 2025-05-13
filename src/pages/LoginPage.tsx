
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async (email: string, password: string) => {
    await login(email, password);
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    await signup(name, email, password);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#E8F0FE] p-4">
      <div className="w-full max-w-md">
        <AuthForm
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
      </div>
    </main>
  );
}
