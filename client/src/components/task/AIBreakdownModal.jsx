import { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Clock, Zap, RotateCcw } from 'lucide-react';
import * as aiService from '../../services/aiService';

const AIBreakdownModal = ({ task, isOpen, onClose, onAccept }) => {
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(() => {
    if (isOpen && task) {
      generateBreakdown();
    }
  }, [isOpen, task]);

  const generateBreakdown = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await aiService.breakdownTask({
        title: task.title,
        description: task.description || '',
      });
      
      setBreakdown(response.breakdown);
    } catch (err) {
      console.error('Error generating breakdown:', err);
      setError(err || 'Failed to generate breakdown. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (breakdown && onAccept) {
      await onAccept(breakdown);
      onClose();
    }
  };

  const handleRegenerate = () => {
    generateBreakdown();
  };

  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1:
        return 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/50';
      case 2:
        return 'bg-[#ffa116]/10 text-[#ffa116] border-[#ffa116]/50';
      case 3:
        return 'bg-red-500/10 text-red-400 border-red-500/50';
      default:
        return 'bg-[#333333] text-[#a0a0a0] border-[#444444]';
    }
  };

  
  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Unknown';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Modal - LeetCode Dark Theme */}
      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#333333] p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center border border-[#00ff88]/20">
                <Sparkles className="w-6 h-6 text-[#00ff88]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Task Breakdown</h2>
                <p className="text-sm text-[#a0a0a0]">Powered by Groq AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#6b6b6b] hover:text-white transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Task Info */}
        <div className="p-6 border-b border-[#333333]">
          <h3 className="text-lg font-semibold text-white mb-2">{task?.title}</h3>
          {task?.description && (
            <p className="text-[#a0a0a0] text-sm">{task.description}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-[#00ff88]/20 border-t-[#00ff88] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium mb-2">Analyzing your task...</p>
              <p className="text-[#a0a0a0] text-sm">AI is breaking it down into focused sessions</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={handleRegenerate} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Try Again
              </button>
            </div>
          )}

          {breakdown && !loading && (
            <>
              {/* Summary Section */}
              <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-[#00ff88]" />
                  <h4 className="text-white font-semibold">Breakdown Summary</h4>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#00ff88]">{breakdown.length}</div>
                    <div className="text-xs text-[#a0a0a0]">Pomodoros</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#ffa116]">
                      {breakdown.length * 25}
                    </div>
                    <div className="text-xs text-[#a0a0a0]">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {Math.round((breakdown.length * 25) / 60 * 10) / 10}
                    </div>
                    <div className="text-xs text-[#a0a0a0]">Hours</div>
                  </div>
                </div>
              </div>

              {/* Breakdown List */}
              <div className="space-y-4 mb-6">
                {breakdown.map((item, index) => (
                  <div
                    key={index}
                    className="bg-[#0a0a0a] rounded-lg p-5 border border-[#333333] hover:border-[#00ff88]/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Pomodoro Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-[#2c2c2c] rounded-lg flex items-center justify-center font-bold text-[#00ff88] text-lg border border-[#444444]">
                          {item.pomodoroNumber}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-white font-semibold text-lg pr-4">
                            {item.subtask}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getDifficultyColor(
                              item.difficulty
                            )}`}
                          >
                            {getDifficultyLabel(item.difficulty)}
                          </span>
                        </div>

                        {/* Steps */}
                        <div className="space-y-2">
                          {item.steps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex items-start gap-2 text-sm text-[#d1d1d1]"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#6b6b6b] mt-0.5 flex-shrink-0" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-2 mt-3 text-xs text-[#6b6b6b]">
                          <Clock className="w-4 h-4" />
                          <span>25 minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 px-4 py-3 bg-[#333333] hover:bg-[#444444] text-white rounded-lg transition-colors border border-[#444444]">
                  Cancel
                </button>
                <button
                  onClick={handleRegenerate}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2c2c2c] hover:bg-[#333333] text-white rounded-lg transition-all border border-[#444444]"
                >
                  <RotateCcw className="w-4 h-4 text-[#00ff88]" />
                  Regenerate
                </button>
                <button onClick={handleAccept} className="flex-1 px-4 py-3 bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold rounded-lg transition-colors">
                  Accept & Use This Breakdown
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBreakdownModal;