import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const TOAST_ICONS = {
  success: <CheckCircle2 className="shrink-0 text-success-text" size={18} />,
  error: <AlertCircle className="shrink-0 text-error-text" size={18} />,
  warning: <AlertTriangle className="shrink-0 text-warning-text" size={18} />,
  info: <Info className="shrink-0 text-info-text" size={18} />,
};

const BORDER_COLORS = {
  success: "border-l-3 border-l-success",
  error: "border-l-3 border-l-error",
  warning: "border-l-3 border-l-warning",
  info: "border-l-3 border-l-info",
};

const PROGRESS_COLORS = {
  success: "bg-success",
  error: "bg-error",
  warning: "bg-warning",
  info: "bg-info",
};

function ToastItem({ id, message, type, duration = 4000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const borderClass = BORDER_COLORS[type] || BORDER_COLORS.info;
  const progressClass = PROGRESS_COLORS[type] || PROGRESS_COLORS.info;

  return (
    <div className={`relative flex items-center justify-between p-[14px_16px] rounded-sm bg-bg-card border border-border-color shadow-lg pointer-events-auto overflow-hidden animate-toast-slide-in backdrop-blur-md transition-all duration-250 ease-in-out ${borderClass}`} role="alert">
      <div className="flex items-center gap-3 flex-1 pr-2">
        {TOAST_ICONS[type] || TOAST_ICONS.info}
        <span className="text-sm font-medium text-text-primary leading-normal">{message}</span>
      </div>
      <button 
        className="bg-transparent border-none text-text-secondary cursor-pointer flex items-center justify-center p-1 rounded-full transition-all duration-120 hover:bg-white/6 hover:text-text-primary shrink-0" 
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
      <div 
        className={`absolute bottom-0 left-0 h-[2px] w-full animate-toast-progress ${progressClass}`}
        style={{ animationDuration: `${duration}ms` }} 
      />
    </div>
  );
}

export default function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-6 right-6 flex flex-col gap-3 z-[9999] pointer-events-none max-w-[380px] w-[calc(100vw-48px)] max-sm:top-auto max-sm:bottom-5 max-sm:right-6 max-sm:left-6 max-sm:w-auto max-sm:max-w-none" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
