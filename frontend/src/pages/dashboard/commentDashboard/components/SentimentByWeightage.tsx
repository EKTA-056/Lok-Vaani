import React from 'react';
import SentimentWeightageChart from './SentimentWeightageChart';
import { dashboardData } from './dashboardData';
import { Header } from '@/components/common/Header';

const SentimentByWeightage: React.FC = () => {
  return (
    <div className=" rounded-xl pt-8 border border-gray-100 transition-shadow duration-300">
      {/* Section Header */}
      <Header text={"Sentiment Analysis according to Weightage"} />

      {/* Chart Container - Full Width */}
      <div className="w-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
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