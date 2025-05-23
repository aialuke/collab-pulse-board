
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormValues, signInSchema } from "@/utils/validation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

interface SignInFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onToggleForm: () => void;
  isLoading: boolean;
}

export function SignInForm({ onSignIn, onToggleForm, isLoading }: SignInFormProps) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SignInFormValues) => {
    try {
      await onSignIn(values.email, values.password);
    } catch (error) {
      // Error handling is done in the parent component
      form.reset({ email: values.email, password: "" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
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
              <div className="flex items-center justify-between">
                <FormLabel className="text-neutral-900">Password</FormLabel>
                <a href="#" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <LockIcon className="h-5 w-5" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
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
      </form>
    </Form>
  );
}
