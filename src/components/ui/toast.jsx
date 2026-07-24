import * as React from "react";
import { cn } from "@/lib/utils";

const ToastProvider = ({ children }) => <>{children}</>;

const ToastViewport = React.forwardRef((props, ref) => (
  <div
    ref={ref}
    className="fixed top-4 right-4 z-50 flex flex-col gap-2"
    {...props}
  />
));

ToastViewport.displayName = "ToastViewport";

const Toast = React.forwardRef(
  ({ className, variant, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-white p-4 shadow-lg",
        variant === "destructive" && "border-red-500",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Toast.displayName = "Toast";

const ToastTitle = ({ children }) => (
  <div className="font-semibold">{children}</div>
);

const ToastDescription = ({ children }) => (
  <div className="text-sm text-slate-600">{children}</div>
);

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
};