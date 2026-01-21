import { Clock, Flame, Target, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  if (!stats) {
    return null;
  }

  // Logic preserved: Mapping stats to card data with updated LeetCode colors
  const cards = [
    {
      title: 'Total Pomodoros',
      value: stats.totalPomodoros || 0,
      icon: Target,
      color: 'green',
      bgColor: 'bg-[#00ff88]/10',
      iconColor: 'text-[#00ff88]',
      borderColor: 'border-[#00ff88]/30',
    },
    {
      title: "Today's Pomodoros",
      value: stats.todayPomodoros || 0,
      icon: Clock,
      color: 'green',
      bgColor: 'bg-[#00ff88]/10',
      iconColor: 'text-[#00ff88]',
      borderColor: 'border-[#00ff88]/30',
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak || 0} days`,
      icon: Flame,
      color: 'orange',
      bgColor: 'bg-[#ffa116]/10',
      iconColor: 'text-[#ffa116]',
      borderColor: 'border-[#ffa116]/30',
      subtitle: `Best: ${stats.longestStreak || 0} days`,
    },
    {
      title: 'Total Focus Time',
      value: `${stats.totalFocusHours || 0}h`,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-[#00ff88]/10',
      iconColor: 'text-[#00ff88]',
      borderColor: 'border-[#00ff88]/30',
      subtitle: `${stats.totalFocusTime || 0} minutes`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`bg-[#1a1a1a] rounded-lg p-6 border ${card.borderColor} transition-all hover:bg-[#2c2c2c]`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center border border-white/5`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
            
            <div className="text-3xl font-bold text-white mb-1">
              {card.value}
            </div>
            
            <div className="text-sm text-[#a0a0a0] mb-1">
              {card.title}
            </div>
            
            {card.subtitle && (
              <div className="text-xs text-[#6b6b6b]">
                {card.subtitle}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;