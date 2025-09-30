import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import { updateSocketCategoryData } from '../../../../store/slices/commentSlice';
import StakeholderCard from './StakeholderCard';
import SentimentLineChart from './SentimentLineChart';
import { useSocketProgress } from '../../../../hooks/useSocketProgress';
import type { StakeholderData } from '@/types';
import { socketUrl } from '@/utils/baseApi';

// Dummy data for chart
const dashboardData = {
  trendData: [
    { week: 'Week 1', positive: 65, negative: 20, neutral: 15 },
    { week: 'Week 2', positive: 70, negative: 15, neutral: 15 },
    { week: 'Week 3', positive: 75, negative: 10, neutral: 15 },
    { week: 'Week 4', positive: 80, negative: 8, neutral: 12 }
  ]
};

const SentimentBreakdown: React.FC = () => {
  const { categoryCommentCounts } = useAppSelector(state => state.comment);
  const dispatch = useAppDispatch();

  // Socket connection for normal users
  const { data: normalSocketData, isConnected: normalConnected } = useSocketProgress({
    endpoint: `${socketUrl}`,
    eventName: 'normal-count-update',
    initialData: {
      positive: categoryCommentCounts?.user.positive || 0,
      negative: categoryCommentCounts?.user.negative || 0,
      neutral: categoryCommentCounts?.user.neutral || 0,
      total: 0
    },
    autoConnect: true
  });

  // Socket connection for industrialist users  
  const { data: industrialistSocketData, isConnected: industrialistConnected } = useSocketProgress({
    endpoint: `${socketUrl}`,
    eventName: 'industrialist-count-update',
    initialData: {
      positive: categoryCommentCounts?.business.positive || 0,
      negative: categoryCommentCounts?.business.negative || 0,
      neutral: categoryCommentCounts?.business.neutral || 0,
      total: 0
    },
    autoConnect: true
  });

  // Update Redux store when socket data changes
  useEffect(() => {
    if (normalSocketData && normalConnected) {
      dispatch(updateSocketCategoryData({
        type: 'normal',
        data: normalSocketData
      }));
    }
  }, [normalSocketData, normalConnected, dispatch]);

  useEffect(() => {
    if (industrialistSocketData && industrialistConnected) {
      dispatch(updateSocketCategoryData({
        type: 'industrialist',
        data: industrialistSocketData
      }));
    }
  }, [industrialistSocketData, industrialistConnected, dispatch]);

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
    <div className="rounded-xl border border-gray-100 transition-shadow duration-300">

      {/* Stakeholder Cards Grid */}
      <div className="w-full flex flex-col md:flex-row gap-4 justify-center items-stretch">
        <StakeholderCard
          title="Comments from Normal Users"
          data={normalUsersData}
          type="normal"
          enableRealtime={true}
        />
        <StakeholderCard
          title="Comments from Businessmen"
          data={industrialistsData}
          type="industrialist"
          enableRealtime={true}
        />

        <div className='w-1/3 bg-white rounded-md shadow-md transition-all duration-300'>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 font-sans">
                Sentiment Trends Over Time
              </h3>
            </div>
          <SentimentLineChart data={dashboardData.trendData} />
        </div>
      </div>
    </div>
  );
};

export default SentimentBreakdown;