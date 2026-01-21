import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-8 text-center border border-[#333333]">
        <p className="text-[#a0a0a0]">No data available yet. Complete some Pomodoros to see your weekly progress!</p>
      </div>
    );
  }

  // Custom tooltip - Logic preserved, colors updated to LeetCode theme
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2c2c2c] rounded-lg p-3 border border-[#00ff88]/50 shadow-xl">
          <p className="text-white font-semibold mb-1">{payload[0].payload.day}</p>
          <p className="text-[#00ff88]">
            {payload[0].value} Pomodoro{payload[0].value !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-[#a0a0a0] mt-1">{payload[0].payload.date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333333]">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Weekly Progress</h3>
        <div className="h-1 w-12 bg-[#00ff88] rounded-full"></div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
            
            <XAxis
              dataKey="day"
              stroke="#6b6b6b"
              tick={{ fill: '#6b6b6b', fontSize: 12 }}
              axisLine={{ stroke: '#333333' }}
              tickLine={false}
            />
            
            <YAxis
              stroke="#6b6b6b"
              tick={{ fill: '#6b6b6b', fontSize: 12 }}
              axisLine={{ stroke: '#333333' }}
              tickLine={false}
              allowDecimals={false}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
            />
            
            <Bar
              dataKey="pomodoros"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary - Logic strictly preserved */}
      <div className="mt-6 pt-4 border-t border-[#333333] flex items-center justify-between text-sm">
        <div>
          <span className="text-[#a0a0a0]">This Week: </span>
          <span className="text-white font-semibold">
            {data.reduce((sum, day) => sum + day.pomodoros, 0)} Pomodoros
          </span>
        </div>
        <div className="text-[#00ff88] font-medium flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></div>
          Active Week
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;