
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormValues, signUpSchema } from "@/utils/validation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

interface SignUpFormProps {
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onToggleForm: () => void;
  isLoading: boolean;
}

export function SignUpForm({ onSignUp, onToggleForm, isLoading }: SignUpFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      await onSignUp(values.name, values.email, values.password);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left">
              <FormLabel className="text-neutral-900">Full Name</FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <UserIcon className="h-5 w-5" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John Doe"
                    autoComplete="name"
                    disabled={isLoading}
                    className="pl-10 border-neutral-200 text-neutral-900 focus:border-teal-500 focus:ring-teal-500"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left">
              <FormLabel className="text-neutral-900">Email</FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <MailIcon className="h-5 w-5" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="example@company.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className="pl-10 border-neutral-200 text-neutral-900 focus:border-teal-500 focus:ring-teal-500"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left">
              <FormLabel className="text-neutral-900">Password</FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <LockIcon className="h-5 w-5" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="pl-10 pr-10 border-neutral-200 text-neutral-900 focus:border-teal-500 focus:ring-teal-500"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-1 text-left">
              <FormLabel className="text-neutral-900">Confirm Password</FormLabel>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <LockIcon className="h-5 w-5" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="pl-10 pr-10 border-neutral-200 text-neutral-900 focus:border-teal-500 focus:ring-teal-500"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-600"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
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
      </form>
    </Form>
  );
}
