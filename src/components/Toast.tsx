import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#70d3a1] shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#efb765] shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#ef7778] shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-[#43d6d0] shrink-0" />;
    }
  };

  return (
    <div className={`toast show toast-item ${toast.type}`}>
      {getIcon()}
      <div className="flex-1 min-w-0 pr-1">
        <div className="font-semibold text-xs text-[#e7f1ef]">{toast.title}</div>
        <div className="text-xs text-[#86a3a3] truncate">{toast.message}</div>
      </div>
      <button
        onClick={onDismiss}
        className="text-[#86a3a3] hover:text-[#e7f1ef] p-1 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
