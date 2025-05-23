
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const { login, signup, authError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the redirect path from location state
  const from = location.state?.from?.pathname || '/';

  const handleSignIn = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      if (!response.error) {
        // Navigate to the page they tried to visit or home
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error handling is done in the AuthContext
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      const response = await signup(name, email, password);
      if (!response.error) {
        // Navigate to the page they tried to visit or home
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error handling is done in the AuthContext
    }
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
