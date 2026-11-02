import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 inset-x-0 z-50 pointer-events-none flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-2xl backdrop-blur-xl animate-rise border ${
            toast.type === 'success'
              ? 'border-emerald-500/50 bg-[#021808]/90 text-emerald-300 shadow-[0_0_20px_rgba(0,255,102,0.3)]'
              : toast.type === 'warn'
              ? 'border-yellow-500/50 bg-[#161203]/90 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
              : toast.type === 'error'
              ? 'border-red-500/50 bg-[#190505]/90 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              : 'border-purple-500/40 bg-[#120626]/90 text-purple-200 shadow-[0_0_20px_rgba(0,0,0,0.8)]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />}
          {toast.type === 'warn' && <AlertTriangle className="size-4 shrink-0 text-yellow-400" />}
          {toast.type === 'error' && <AlertCircle className="size-4 shrink-0 text-red-400" />}
          {toast.type === 'info' && <Info className="size-4 shrink-0 text-[#c084fc]" />}
          <span className="digital text-[10.5px] tracking-wide">{toast.text}</span>
          <button
            type="button"
            onClick={() => onRemove(toast.id)}
            className="ml-1 text-zinc-400 hover:text-white p-0.5"
          >
            <X className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
