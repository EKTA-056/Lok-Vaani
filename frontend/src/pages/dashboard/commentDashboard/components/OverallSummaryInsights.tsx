import React from 'react';
import SummaryInsights from './SummaryInsights';
import PolicyInsights from './PolicyInsights';
import type { OverallInsightsData } from './dashboardData';

interface OverallSummaryInsightsProps {
  data: OverallInsightsData;
}

const OverallSummaryInsights: React.FC<OverallSummaryInsightsProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Section Header with Mini Trend Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sans">
              Overall Summary and Insights
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
          
          {/* Mini Sentiment Trend Bar */}
          <div className="flex items-center space-x-2">
            <div className="text-xs font-medium text-gray-500">Sentiment Trend:</div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-8 bg-gradient-to-t from-green-400 to-green-600 rounded-sm"></div>
              <div className="w-3 h-6 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-sm"></div>
              <div className="w-3 h-4 bg-gradient-to-t from-red-400 to-red-600 rounded-sm"></div>
              <div className="w-3 h-7 bg-gradient-to-t from-green-400 to-green-600 rounded-sm"></div>
              <div className="w-3 h-5 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Summary Section */}
        <div>
          <SummaryInsights data={data.summary} />
        </div>

        {/* Right Column - Policy Insights Section */}
        <div>
          <PolicyInsights data={data.policyInsights} />
        </div>
      </div>
    </div>
  );
};

export default OverallSummaryInsights;