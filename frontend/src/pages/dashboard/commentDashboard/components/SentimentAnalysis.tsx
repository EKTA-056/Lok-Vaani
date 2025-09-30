import React, { useEffect } from 'react';
import SentimentWeightageChart from './SentimentWeightageChart';
import SentimentDonutChart from './SentimentDonutChart';
import { updateSocketWeightage } from '../../../../store/slices/commentSlice';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { useSocketProgress } from '../../../../hooks/useSocketProgress';

// Interface for weighted socket data
interface WeightedSocketData {
  totalAnalyzedComments: number;
  totalWeightedScore: number;
  weightedPercentages: {
    positive: number;
    negative: number;
    neutral: number;
  };
  categoryBreakdown?: {
    user: {
      positive: number;
      negative: number;
      neutral: number;
      totalWeight: number;
    };
    business: {
      positive: number;
      negative: number;
      neutral: number;
      totalWeight: number;
    };
  };
  rawWeights?: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

const SentimentAnalysis: React.FC = () => {
    const { commentsWeightage } = useAppSelector(state => state.comment);
    const dispatch = useAppDispatch();
    
    // Initialize socket for real-time updates
    const { isConnected, data: socketData } = useSocketProgress({
      endpoint: 'http://localhost:4000',
      eventName: 'weighted-total-count-update',
      initialData: {
        positive: commentsWeightage?.weightedPercentages?.positive || 0,
        negative: commentsWeightage?.weightedPercentages?.negative || 0,
        neutral: commentsWeightage?.weightedPercentages?.neutral || 0,
        total: commentsWeightage?.totalAnalyzedComments || 0
      },
      autoConnect: true
    }); 
    
    // Type assertion for weighted socket data
    const weightedSocketData = socketData as unknown as WeightedSocketData;
  
    // Update Redux store when socket data changes
    useEffect(() => {
      if (socketData && isConnected) {
        // socketData contains the full weighted response structure
        // Type assertion through unknown since the hook expects SocketProgressData but we receive weighted data
        dispatch(updateSocketWeightage(socketData as unknown as WeightedSocketData));
      }
    }, [socketData, isConnected, dispatch]);
    
    console.log("Weightage socketData:", socketData);
    console.log("Weighted percentages:", weightedSocketData?.weightedPercentages);
  return (
    <div className="rounded-xl pt-8 border border-gray-100 transition-shadow duration-300">
      {/* Charts Container - Side by Side */}
        <div className="w-full flex flex-row gap-6">
          {/* Donut Chart Container */}
          <div className="w-2/5 bg-white rounded-2xl border border-gray-200 shadow-sm pt-8 hover:shadow-md transition-all duration-300">
            {/* Chart Header */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-800">
                Overall Sentiment Distribution by Weightage
              </h3>
            </div>
              <SentimentDonutChart 
                data={weightedSocketData?.weightedPercentages || commentsWeightage?.weightedPercentages || { positive: 0, negative: 0, neutral: 0 }} 
              />
          </div>

          <div className="w-3/5 bg-white rounded-2xl border border-gray-200 shadow-sm pt-8 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl px-8 font-semibold text-slate-800">
                Overall Sentiment Distribution by Category
              </h3>
            <SentimentWeightageChart data={[
              { category: 'Users', positive: 45, negative: 25, neutral: 30 },
            ]} />
          </div>
        </div>
    </div>
  );
};

export default SentimentAnalysis;