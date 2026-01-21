import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

const TimerControls = ({ 
  onStart, 
  onPause, 
  onReset, 
  onSkip,
  isActive, 
  isBreak 
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Start/Pause Button */}
      {!isActive ? (
        <button
          onClick={onStart}
          className="btn-primary flex items-center gap-2 px-8 py-4 text-lg"
        >
          <Play className="w-6 h-6" fill="currentColor" />
          Start
        </button>
      ) : (
        <button
          onClick={onPause}
          className="btn-secondary flex items-center gap-2 px-8 py-4 text-lg"
        >
          <Pause className="w-6 h-6" fill="currentColor" />
          Pause
        </button>
      )}

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="glass hover:bg-white/10 text-gray-300 hover:text-white px-6 py-4 rounded-lg transition-all flex items-center gap-2"
        title="Reset Timer"
      >
        <RotateCcw className="w-5 h-5" />
        <span className="hidden sm:inline">Reset</span>
      </button>

      {/* Skip Break Button (only show during break) */}
      {isBreak && (
        <button
          onClick={onSkip}
          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-6 py-4 rounded-lg transition-all flex items-center gap-2 border border-green-500/50"
          title="Skip Break"
        >
          <SkipForward className="w-5 h-5" />
          <span className="hidden sm:inline">Skip Break</span>
        </button>
      )}
    </div>
  );
};

export default TimerControls;