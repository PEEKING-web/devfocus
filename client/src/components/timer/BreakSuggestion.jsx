import { useState, useEffect } from 'react';
import { Coffee, Sparkles, RefreshCw } from 'lucide-react';
import * as aiService from '../../services/aiService';

const BreakSuggestion = ({ sessionCount, timeOfDay }) => {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchSuggestion();
  }, [sessionCount]);

  const fetchSuggestion = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const response = await aiService.suggestBreak(
        sessionCount,
        timeOfDay || new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      );
      
      setSuggestion(response.suggestion);
    } catch (err) {
      console.error('Error fetching break suggestion:', err);
      setError(true);
      // Fallback suggestion
      setSuggestion('Stand up, stretch your arms and legs, and look at something 20 feet away for 20 seconds.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    fetchSuggestion();
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-8 border border-[#333333] animate-fade-in shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-16 h-16 bg-[#00ff88]/10 rounded-full flex items-center justify-center border border-[#00ff88]/20">
          <Coffee className="w-10 h-10 text-[#00ff88]" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-1">Break Time! ☕</h2>
          <p className="text-[#a0a0a0] text-sm">You've earned it after {sessionCount} session{sessionCount !== 1 ? 's' : ''}!</p>
        </div>
      </div>

      {/* Suggestion Card */}
      <div className="bg-[#0a0a0a] border border-[#333333] rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#00ff88]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">AI Suggestion</h3>
            
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-[#2c2c2c] rounded animate-pulse w-full"></div>
                <div className="h-4 bg-[#2c2c2c] rounded animate-pulse w-3/4"></div>
              </div>
            ) : (
              <p className="text-[#d1d1d1] leading-relaxed">{suggestion}</p>
            )}
          </div>
        </div>

        {!loading && (
          <button
            onClick={handleRegenerate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2c2c2c] hover:bg-[#333333] text-white rounded-lg transition-all text-sm border border-[#444444]"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 text-[#00ff88]" />
            Get Another Suggestion
          </button>
        )}
      </div>

      {/* Quick Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#2c2c2c] border border-[#333333] rounded-lg p-4 text-center group hover:border-[#00ff88]/50 transition-colors">
          <div className="text-2xl mb-2">👀</div>
          <div className="text-sm text-[#a0a0a0]">Rest your eyes from the screen</div>
        </div>
        <div className="bg-[#2c2c2c] border border-[#333333] rounded-lg p-4 text-center group hover:border-[#00ff88]/50 transition-colors">
          <div className="text-2xl mb-2">🚶</div>
          <div className="text-sm text-[#a0a0a0]">Move your body and stretch</div>
        </div>
        <div className="bg-[#2c2c2c] border border-[#333333] rounded-lg p-4 text-center group hover:border-[#00ff88]/50 transition-colors">
          <div className="text-2xl mb-2">💧</div>
          <div className="text-sm text-[#a0a0a0]">Hydrate and grab water</div>
        </div>
      </div>

      {/* Motivation */}
      <div className="text-center border-t border-[#333333] pt-6">
        <p className="text-sm text-[#6b6b6b] italic">
          "Breaks aren't wasted time — they're when your brain consolidates learning and creativity sparks."
        </p>
      </div>
    </div>
  );
};

export default BreakSuggestion;