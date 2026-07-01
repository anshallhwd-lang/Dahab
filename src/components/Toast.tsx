import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number; // in milliseconds
}

interface ToastItemProps {
  key?: string;
  toast: ToastMessage;
  onClose: (id: string) => void;
  isRtl: boolean;
}

export function ToastItem({ toast, onClose, isRtl }: ToastItemProps) {
  const { id, message, type, duration = 4000 } = toast;
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPercent);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleClose();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // matches the transform transition time
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-[#00B2FE] shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 hover:border-emerald-500/50";
      case "error":
        return "border-red-500/30 hover:border-red-500/50";
      case "info":
      default:
        return "border-[#00B2FE]/30 hover:border-[#00B2FE]/50";
    }
  };

  const getProgressBg = () => {
    switch (type) {
      case "success":
        return "bg-emerald-500";
      case "error":
        return "bg-red-500";
      case "info":
      default:
        return "bg-[#00B2FE]";
    }
  };

  return (
    <div
      id={`toast-item-${id}`}
      className={`
        relative overflow-hidden w-full max-w-sm bg-zinc-950/95 backdrop-blur-md 
        border ${getBorderColor()} rounded-xl p-4 shadow-xl shadow-black/50
        transition-all duration-300 ease-out flex gap-3.5 items-start
        ${isExiting ? "opacity-0 scale-90 translate-y-[-10px]" : "opacity-100 scale-100 translate-y-0 animate-fade-in-down"}
      `}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* Icon */}
      <div className="pt-0.5">{getIcon()}</div>

      {/* Message Text */}
      <div className="flex-1 text-sm font-medium text-zinc-100 tracking-tight leading-relaxed">
        {message}
      </div>

      {/* Manual Dismiss Button */}
      <button
        onClick={handleClose}
        className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800/80 transition-all cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Shrinking progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-900/50">
        <div
          className={`h-full ${getProgressBg()} transition-all duration-[25ms] ease-linear`}
          style={{
            width: `${progress}%`,
            float: isRtl ? "right" : "left",
          }}
        />
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  isRtl: boolean;
}

export default function ToastContainer({ toasts, removeToast, isRtl }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-notification-container"
      className={`
        fixed z-50 max-w-[calc(100vw-2rem)] w-full sm:w-[400px] flex flex-col gap-3
        pointer-events-auto
        bottom-6 sm:top-6 sm:bottom-auto
        ${isRtl ? "left-4 sm:left-6 right-auto" : "right-4 sm:right-6 left-auto"}
      `}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} isRtl={isRtl} />
      ))}
    </div>
  );
}
