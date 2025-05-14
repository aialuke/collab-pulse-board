
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { NameInput } from "./NameInput";

interface SignUpFormProps {
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onToggleForm: () => void;
  isLoading: boolean;
}

export function SignUpForm({ onSignUp, onToggleForm, isLoading }: SignUpFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onSignUp(name, email, password);
    } catch (error) {
      // Error handling is already in the onSignUp function
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        <NameInput
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
        
        <EmailInput
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        
        <PasswordInput
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          isNewPassword={true}
        />
        
        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Confirm Password"
          disabled={isLoading}
          isNewPassword={true}
        />
        
        <Button
          type="submit"
          className="w-full mt-6 bg-gradient-teal hover:shadow-teal-glow text-white font-medium rounded-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </form>
  );
}
