import React from 'react';
import { Clock } from 'lucide-react';

const TimerDisplay = ({ timeLeft, isActive, isBreak }) => {
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Logic for progress calculation
  const totalTime = isBreak ? 5 * 60 : 25 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Status Label - Glowing border removed for a cleaner look */}
      <div className="mb-8">
        <span
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-500 ${
            isBreak
              ? 'bg-[#1a1a1a] text-[#00ff88]'
              : 'bg-[#1a1a1a] text-[#00cc6a]'
          }`}
        >
          {isBreak ? '☕ Break Time' : '💻 Focus Time'}
        </span>
      </div>

      {/* Circular Timer */}
      <div className="relative">
        <svg className="transform -rotate-90" width="280" height="280">
          {/* Background Circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="#1a1a1a"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke={isBreak ? '#00ff88' : '#00cc6a'}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            style={{
              filter: `drop-shadow(0 0 8px ${isBreak ? 'rgba(0, 255, 136, 0.3)' : 'rgba(0, 204, 106, 0.3)'})`,
            }}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Clock className="w-8 h-8 text-[#6b6b6b] mb-2" />
          <div className="text-7xl font-bold text-white tracking-wider">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-[#a0a0a0] mt-2">
            {isActive ? 'In Progress' : 'Paused'}
          </div>
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="mt-8 text-[#a0a0a0] text-sm">
        {Math.round(progress)}% Complete
      </div>
    </div>
  );
};

export default TimerDisplay;