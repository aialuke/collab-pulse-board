
// Re-export from the radix-ui toast component
import { useToast as useToastOriginal, toast as toastOriginal } from "@/components/ui/toast";

// Re-export with additional context or modifications if needed
export const useToast = useToastOriginal;
export const toast = toastOriginal;
