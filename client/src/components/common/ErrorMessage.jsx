import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-400 text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;