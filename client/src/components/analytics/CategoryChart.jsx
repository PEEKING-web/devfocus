import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CategoryChart = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-gray-400">No tasks yet. Create tasks with categories to see distribution!</p>
      </div>
    );
  }

  // Calculate time per category
  const categoryData = tasks.reduce((acc, task) => {
    const category = task.category || 'uncategorized';
    const time = task.completedPomodoros * 25; // 25 minutes per Pomodoro

    if (acc[category]) {
      acc[category] += time;
    } else {
      acc[category] = time;
    }
    return acc;
  }, {});

  // Convert to array for chart
  const chartData = Object.entries(categoryData)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      minutes: value,
      hours: (value / 60).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value);

  // If no completed Pomodoros yet
  if (chartData.every(item => item.value === 0)) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-gray-400">Complete some Pomodoros to see category distribution!</p>
      </div>
    );
  }

  // Colors for different categories
  const COLORS = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#10b981', // green
    '#f59e0b', // orange
    '#ef4444', // red
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
  ];

  // Custom label
  const renderLabel = (entry) => {
    const percent = ((entry.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0);
    return `${percent}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark rounded-lg p-3 border border-blue-500/50">
          <p className="text-white font-semibold mb-1">{payload[0].payload.name}</p>
          <p className="text-blue-400 text-sm">
            {payload[0].payload.hours}h ({payload[0].payload.minutes} min)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Category Distribution</h3>
        <p className="text-sm text-gray-400">Time spent on different task categories</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend with details */}
      <div className="mt-6 space-y-2">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-white font-medium">{item.name}</span>
            </div>
            <span className="text-gray-400 text-sm">{item.hours}h</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;