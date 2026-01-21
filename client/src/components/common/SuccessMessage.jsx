import { CheckCircle2, X } from 'lucide-react';

const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6 animate-fade-in">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-green-400 text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;