
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const { login, signup, authError } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    await login(email, password);
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    await signup(name, email, password);
  };

  return (
    <>
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {authError.message}
          </AlertDescription>
        </Alert>
      )}
      
      <AuthForm
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    </>
  );
}
