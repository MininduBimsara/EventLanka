// ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "./Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = {
    success: useCallback(
      (message, duration = 5000) => addToast(message, "success", duration),
      [addToast]
    ),
    error: useCallback(
      (message, duration = 5000) => addToast(message, "error", duration),
      [addToast]
    ),
    warning: useCallback(
      (message, duration = 5000) => addToast(message, "warning", duration),
      [addToast]
    ),
    info: useCallback(
      (message, duration = 5000) => addToast(message, "info", duration),
      [addToast]
    ),
    clearAll: clearAllToasts,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {toasts.map((toastItem, index) => (
          <div
            key={toastItem.id}
            className="pointer-events-auto"
            style={{
              transform: `translateY(${index * 80}px)`,
            }}
          >
            <Toast
              message={toastItem.message}
              type={toastItem.type}
              duration={toastItem.duration}
              onClose={() => removeToast(toastItem.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
