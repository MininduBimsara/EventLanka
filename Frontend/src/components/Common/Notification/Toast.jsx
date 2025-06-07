// Toast.jsx
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X, Info, AlertTriangle } from "lucide-react";

const Toast = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
  position = "top-right",
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation before duration ends
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);

    return () => clearTimeout(exitTimer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300); // Animation duration
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          text: "text-green-800",
          icon: CheckCircle,
          iconColor: "text-green-500",
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          text: "text-red-800",
          icon: AlertCircle,
          iconColor: "text-red-500",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          text: "text-yellow-800",
          icon: AlertTriangle,
          iconColor: "text-yellow-500",
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-800",
          icon: Info,
          iconColor: "text-blue-500",
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      case "bottom-right":
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

  return (
    <div
      className={`fixed z-50 ${getPositionStyles()} transition-all duration-300 ${
        isExiting
          ? "opacity-0 transform translate-x-full"
          : "opacity-100 transform translate-x-0"
      }`}
    >
      <div
        className={`flex items-center p-4 border rounded-lg shadow-lg min-w-80 max-w-md ${styles.bg}`}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
          </div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
          </div>
        </div>
        <div className="pl-3 ml-auto">
          <button
            onClick={handleClose}
            className={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none ${styles.text}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
