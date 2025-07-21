import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: XCircle,
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          icon: AlertCircle,
          iconColor: 'text-yellow-600'
        };
      case 'info':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          icon: Info,
          iconColor: 'text-blue-600'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: Info,
          iconColor: 'text-gray-600'
        };
    }
  };

  const style = getToastStyle();
  const IconComponent = style.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`flex items-center p-4 border rounded-lg shadow-lg ${style.bgColor} ${style.borderColor} max-w-sm`}>
        <IconComponent className={`h-5 w-5 mr-3 ${style.iconColor}`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${style.textColor}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`ml-3 ${style.textColor} hover:opacity-70 transition-opacity`}
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;