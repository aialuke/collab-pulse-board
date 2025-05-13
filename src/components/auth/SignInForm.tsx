
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";

interface SignInFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onToggleForm: () => void;
  isLoading: boolean;
}

export function SignInForm({ onSignIn, onToggleForm, isLoading }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onSignIn(email, password);
      // Don't clear email on success - the user will be redirected anyway
    } catch (error) {
      // Password is cleared but email is maintained
      setPassword("");
      // Error handling is already in the onSignIn function
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        <EmailInput
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          forgotPasswordLink
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          className="w-full mt-6 bg-gradient-yellow hover:shadow-glow text-neutral-900 font-medium rounded-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}
