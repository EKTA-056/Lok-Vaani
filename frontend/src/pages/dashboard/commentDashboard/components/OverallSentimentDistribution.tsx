import React from 'react';
import SentimentDonutChart from './SentimentDonutChart';
import { dashboardData } from './dashboardData';

const OverallSentimentDistribution: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-md transition-all duration-300">
      {/* Chart Header */}
      <div className="mb-8 text-center">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Overall Sentiment Distribution
        </h3>
        <p className="text-sm text-slate-600">
          Breakdown of all analyzed comments
        </p>
      </div>

      {/* Donut Chart */}
      <div className="flex justify-center">
        <SentimentDonutChart 
          data={dashboardData.stats} 
          totalComments={dashboardData.totalComments}
        />
      </div>
    </div>
  );
};

export default OverallSentimentDistribution;