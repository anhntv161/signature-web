import { toast as sonnerToast } from "sonner";

// Re-export sonner's toast with a simplified API
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    sonnerToast.error(message, { description });
  },
  info: (message: string, description?: string) => {
    sonnerToast.info(message, { description });
  },
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, { description });
  },
  message: (message: string, description?: string) => {
    sonnerToast(message, { description });
  },
  promise: sonnerToast.promise,
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
};

export const useToast = () => {
  return { toast };
};
