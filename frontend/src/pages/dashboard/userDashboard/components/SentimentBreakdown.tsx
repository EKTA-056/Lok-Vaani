import React from 'react';
import { useAppSelector } from '../../../../hooks/redux';
import StakeholderCard from './StakeholderCard';
import { Header } from '@/components/common/Header';
import type { StakeholderData } from './dashboardData';

const SentimentBreakdown: React.FC = () => {
  const { categoryCommentCounts } = useAppSelector(state => state.comment);

  // Transform API data to component format
  const normalUsersData: StakeholderData = {
    totalComments: categoryCommentCounts 
      ? categoryCommentCounts.user.positive + categoryCommentCounts.user.negative + categoryCommentCounts.user.neutral
      : 0,
    stats: {
      positive: categoryCommentCounts?.user.positive || 0,
      negative: categoryCommentCounts?.user.negative || 0,
      neutral: categoryCommentCounts?.user.neutral || 0
    }
  };

  const industrialistsData: StakeholderData = {
    totalComments: categoryCommentCounts 
      ? categoryCommentCounts.business.positive + categoryCommentCounts.business.negative + categoryCommentCounts.business.neutral
      : 0,
    stats: {
      positive: categoryCommentCounts?.business.positive || 0,
      negative: categoryCommentCounts?.business.negative || 0,
      neutral: categoryCommentCounts?.business.neutral || 0
    }
  };

  return (
    <div className="rounded-xl shadow-md p-8 border border-gray-100 transition-shadow duration-300">
      {/* Section Header */}
      <Header text={"Sentiment Breakdown by Stakeholder Type"} />

      {/* Stakeholder Cards Grid */}
      <div className="w-full flex flex-col md:flex-row gap-16 justify-center items-stretch">
        <StakeholderCard
          title="Comments from Normal Users"
          data={normalUsersData}
          type="normal"
        />
        <StakeholderCard
          title="Comments from Industrialists/Businessmen"
          data={industrialistsData}
          type="industrialist"
        />
      </div>
    </div>
  );
};

export default SentimentBreakdown;