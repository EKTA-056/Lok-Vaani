import React from 'react';

interface StatCardProps {
  type: 'positive' | 'negative' | 'neutral';
  count: number;
  percentage: string;
}

const StatCard: React.FC<StatCardProps> = ({ type, count, percentage }) => {
  const getCardConfig = () => {
    switch (type) {
      case 'positive':
        return {
          title: 'Positive Comments',
          gradient: 'bg-gradient-to-br from-green-50 to-emerald-100',
          textColor: 'text-emerald-700',
          accentColor: 'text-emerald-500',
          borderColor: 'border-emerald-200',
        };
      case 'negative':
        return {
          title: 'Negative Comments',
          gradient: 'bg-gradient-to-br from-red-50 to-rose-100',
          textColor: 'text-rose-700',
          accentColor: 'text-rose-500',
          borderColor: 'border-rose-200',
        };
      case 'neutral':
        return {
          title: 'Neutral Comments',
          gradient: 'bg-gradient-to-br from-amber-50 to-yellow-100',
          textColor: 'text-amber-700',
          accentColor: 'text-amber-500',
          borderColor: 'border-amber-200',
        };
    }
  };

  const config = getCardConfig();

  return (
    <div className={`p-8 rounded-2xl ${config.gradient} ${config.borderColor} border shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] backdrop-blur-sm`}>
      <div className="text-center space-y-4">
        <div className={`text-4xl font-bold ${config.textColor}`}>
          {count.toLocaleString()}
        </div>
        <div className={`text-lg font-semibold ${config.textColor}`}>
          {config.title}
        </div>
        <div className={`text-sm ${config.accentColor} font-medium`}>
          {percentage}% of total
        </div>
      </div>
    </div>
  );
};

export default StatCard;