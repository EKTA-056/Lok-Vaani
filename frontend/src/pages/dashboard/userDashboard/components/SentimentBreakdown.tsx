import React from 'react';
import StakeholderCard from './StakeholderCard';
import { dashboardData } from './dashboardData';

const SentimentBreakdown: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-sans">
          Sentiment Breakdown by Stakeholder Type
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Stakeholder Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StakeholderCard
          title="Comments from Normal Users"
          data={dashboardData.stakeholders.normalUsers}
          type="normal"
        />
        <StakeholderCard
          title="Comments from Industrialists/Businessmen"
          data={dashboardData.stakeholders.industrialists}
          type="industrialist"
        />
      </div>
    </div>
  );
};

export default SentimentBreakdown;