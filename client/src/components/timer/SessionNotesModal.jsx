import { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';

const SessionNotesModal = ({ isOpen, onClose, onSave, taskTitle }) => {
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(notes);
    setSaving(false);
    setNotes('');
    onClose();
  };

  const handleSkip = () => {
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-dark rounded-2xl max-w-2xl w-full shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Session Complete! 🎉</h2>
                <p className="text-sm text-gray-400">How did it go?</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={saving}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Task Info */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Task:</p>
            <p className="text-white font-medium">{taskTitle}</p>
          </div>

          {/* Notes Textarea */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              What did you accomplish? 📝
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field min-h-[150px] resize-none"
              placeholder="Example:
- Completed user authentication setup
- Fixed 2 bugs in login flow
- Researched JWT best practices
              
Write anything - what worked, what didn't, blockers, ideas..."
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Documenting your progress helps identify patterns and stay motivated!
            </p>
          </div>

          {/* Quick Suggestions */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {[
                '✅ Completed as planned',
                '🔨 Made good progress',
                '🐛 Fixed bugs',
                '📚 Did research',
                '🚧 Hit a blocker',
                '💡 Had an insight',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setNotes(notes + (notes ? '\n' : '') + suggestion)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 btn-secondary"
              disabled={saving}
            >
              Skip for Now
            </button>
            <button
              onClick={handleSave}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="loading-spinner w-5 h-5"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Notes
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="border-t border-gray-700 p-4 bg-gray-800/50">
          <p className="text-center text-sm text-gray-400">
            🔥 Great job staying focused! Take your break, you earned it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionNotesModal;