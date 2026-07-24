import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "./toast";

import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          {toast.description && (
            <ToastDescription>{toast.description}</ToastDescription>
          )}
        </Toast>
      ))}

      <ToastViewport />
    </ToastProvider>
  );
}