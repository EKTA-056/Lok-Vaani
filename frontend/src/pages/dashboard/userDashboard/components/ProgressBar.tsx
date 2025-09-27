import React from 'react';

interface ProgressBarProps {
  type: 'positive' | 'negative' | 'neutral';
  percentage: number;
  count: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ type, percentage, count }) => {
  const getBarConfig = () => {
    switch (type) {
      case 'positive':
        return {
          label: 'Positive',
          bgColor: 'bg-emerald-100',
          fillGradient: 'bg-gradient-to-r from-emerald-400 to-green-500',
          textColor: 'text-emerald-700',
        };
      case 'negative':
        return {
          label: 'Negative',
          bgColor: 'bg-rose-100',
          fillGradient: 'bg-gradient-to-r from-rose-400 to-red-500',
          textColor: 'text-rose-700',
        };
      case 'neutral':
        return {
          label: 'Neutral',
          bgColor: 'bg-amber-100',
          fillGradient: 'bg-gradient-to-r from-amber-400 to-yellow-500',
          textColor: 'text-amber-700',
        };
    }
  };

  const config = getBarConfig();

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-3">
        <span className={`font-semibold ${config.textColor}`}>
          {config.label}
        </span>
        <span className={`font-bold ${config.textColor} text-sm`}>
          {count.toLocaleString()} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className={`w-full h-2 ${config.bgColor} rounded-full overflow-hidden shadow-inner`}>
        <div 
          className={`h-full ${config.fillGradient} rounded-full transition-all duration-1000 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;