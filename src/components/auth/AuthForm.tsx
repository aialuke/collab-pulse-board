
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

type AuthFormProps = {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
};

export default function AuthForm({ onSignIn, onSignUp }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await onSignIn(email, password);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await onSignUp(name, email, password);
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <Card className="w-full border border-neutral-200 bg-white shadow-md p-6 mx-auto">
      <h2 className="text-xl text-gradient-teal mb-4">
        {isSignIn ? "Sign In" : "Create an Account"}
      </h2>
      
      {isSignIn ? (
        <SignInForm 
          onSignIn={handleSignIn}
          onToggleForm={toggleAuthMode}
          isLoading={isLoading}
        />
      ) : (
        <SignUpForm 
          onSignUp={handleSignUp}
          onToggleForm={toggleAuthMode}
          isLoading={isLoading}
        />
      )}
    </Card>
  );
}
