import React from 'react';
import ProgressBar from './ProgressBar';
import { getStakeholderPercentages } from './dashboardData';
import type { StakeholderData } from './dashboardData';

interface StakeholderCardProps {
  title: string;
  data: StakeholderData;
  type: 'normal' | 'industrialist';
}

const StakeholderCard: React.FC<StakeholderCardProps> = ({ title, data, type }) => {
  const percentages = getStakeholderPercentages(data);

  const getCardConfig = () => {
    if (type === 'normal') {
      return {
        gradient: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
        borderColor: 'border-indigo-200',
        titleColor: 'text-indigo-700',
        subtitleColor: 'text-indigo-600'
      };
    } else {
      return {
        gradient: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
        borderColor: 'border-teal-200',
        titleColor: 'text-teal-700',
        subtitleColor: 'text-teal-600'
      };
    }
  };

  const config = getCardConfig();

  return (
    <div className={`${config.gradient} rounded-2xl border ${config.borderColor} shadow-sm p-8 hover:shadow-md transition-all duration-300 backdrop-blur-sm`}>
      {/* Title and Total */}
      <div className="text-center mb-8">
        <h3 className={`text-xl font-bold ${config.titleColor} mb-3`}>{title}</h3>
        <p className={`text-sm ${config.subtitleColor} font-medium`}>
          Total: <span className="font-bold">{data.totalComments.toLocaleString()} Comments</span>
        </p>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        <ProgressBar
          type="positive"
          percentage={parseFloat(percentages.positive)}
          count={data.stats.positive}
        />
        <ProgressBar
          type="negative"
          percentage={parseFloat(percentages.negative)}
          count={data.stats.negative}
        />
        <ProgressBar
          type="neutral"
          percentage={parseFloat(percentages.neutral)}
          count={data.stats.neutral}
        />
      </div>
    </div>
  );
};

export default StakeholderCard;