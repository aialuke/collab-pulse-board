
// Import the toast from shadcn/ui toast
import { Toast, ToasterToast, useToast as useShadcnToast } from "@/components/ui/toast";

// Re-export the useToast hook 
export const useToast = useShadcnToast;

// Re-export the toast function directly for easier use in non-component files
export const { toast } = useShadcnToast();

// Export types
export type { Toast, ToasterToast };
