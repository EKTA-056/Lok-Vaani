import React from 'react';
import SentimentWeightageChart from './SentimentWeightageChart';
import { dashboardData } from './dashboardData';

const SentimentByWeightage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sans">
          Sentiment Analysis according to Weightage
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Chart Container - Full Width */}
      <div className="w-full">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
          {/* Chart Header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">
              Comment Sentiment Distribution by Weightage
            </h3>
            <p className="text-sm text-gray-600 font-sans">
              Comparison of sentiment patterns across different comment weightage categories
            </p>
          </div>

          {/* Bar Chart */}
          <div className="w-full">
            <SentimentWeightageChart data={dashboardData.weightageData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentByWeightage;