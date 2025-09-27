import React from 'react';
import SentimentLineChart from './SentimentLineChart';
import OverallSentimentDistribution from './OverallSentimentDistribution';
import { dashboardData } from './dashboardData';

const SentimentAnalysis: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sans">
          Sentiment Analysis & Trends
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Charts Container - Side by Side */}
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Line Chart Container */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
            {/* Chart Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">
                Sentiment Trends Over Time
              </h3>
              <p className="text-sm text-gray-600 font-sans">
                Weekly sentiment analysis
              </p>
            </div>

            {/* Line Chart */}
            <div className="w-full">
              <SentimentLineChart data={dashboardData.trendData} />
            </div>
          </div>

          {/* Donut Chart Container */}
          <OverallSentimentDistribution />
          
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;