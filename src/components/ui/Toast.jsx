'use client';

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

/**
 * Toast notification component
 * Works as a standalone component — for app-wide toasts use react-hot-toast (already configured in layout)
 */
export default function Toast({ message, type = 'info', duration = 4000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const types = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: FaCheckCircle,
      iconColor: 'text-green-600',
      text: 'text-green-800',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: FaExclamationCircle,
      iconColor: 'text-red-600',
      text: 'text-red-800',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: FaInfoCircle,
      iconColor: 'text-blue-600',
      text: 'text-blue-800',
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: FaExclamationCircle,
      iconColor: 'text-yellow-600',
      text: 'text-yellow-800',
    },
  };

  const { bg, icon: Icon, iconColor, text } = types[type] || types.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${bg} shadow-lg transition-all duration-300 max-w-sm`}
      role="alert"
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
      <p className={`flex-1 text-sm font-medium ${text}`}>{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className={`${iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Dismiss"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * ToastContainer — renders multiple toasts stacked
 */
export function ToastContainer({ toasts = [], onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => onRemove?.(toast.id)}
        />
      ))}
    </div>
  );
}
