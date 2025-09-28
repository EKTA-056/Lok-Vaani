import React from 'react';
import SentimentLineChart from './SentimentLineChart';
import OverallSentimentDistribution from './OverallSentimentDistribution';
import { dashboardData } from './dashboardData';
import { Header } from '@/components/common/Header';

const SentimentAnalysis: React.FC = () => {
  return (
    <div className="rounded-xl pt-8 border border-gray-100 transition-shadow duration-300">
      {/* Section Header */}
      <Header text={"Sentiment Analysis & Trends"} />

      {/* Charts Container - Side by Side */}
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Line Chart Container */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
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