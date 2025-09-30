import React, { useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { useSocketProgress } from '../../../../hooks/useSocketProgress';
import type { StakeholderData } from '@/types';
import { socketUrl } from '@/utils/baseApi';

// Helper function to calculate percentages
const getStakeholderPercentages = (data: StakeholderData) => {
  const total = data.totalComments || 1;
  return {
    positive: ((data.stats.positive / total) * 100).toFixed(1),
    negative: ((data.stats.negative / total) * 100).toFixed(1),
    neutral: ((data.stats.neutral / total) * 100).toFixed(1)
  };
};

interface StakeholderCardProps {
  title: string;
  data: StakeholderData;
  type: 'normal' | 'industrialist';
  enableRealtime?: boolean;
}

const StakeholderCard: React.FC<StakeholderCardProps> = ({ 
  title, 
  data, 
  type,
  enableRealtime = true // Enable by default
}) => {
  const percentages = getStakeholderPercentages(data);

  // Socket integration for real-time updates
  const {
    isConnected,
    data: socketData,
    percentages: socketPercentages,
    error
  } = useSocketProgress({
    endpoint: `${socketUrl}`,
    eventName: type === 'normal' ? 'normal-count-update' : 'industrialist-count-update',
    initialData: {
      positive: data.stats.positive,
      negative: data.stats.negative,
      neutral: data.stats.neutral,
      total: data.totalComments
    },
    autoConnect: enableRealtime
  });

  // Debug logging for socket connection
  useEffect(() => {
    console.log(`🔌 [StakeholderCard ${type}] Socket connected:`, isConnected);
    if (socketData) {
      console.log(`📊 [StakeholderCard ${type}] Received data:`, socketData);
    }
    if (error) {
      console.error(`❌ [StakeholderCard ${type}] Socket error:`, error);
    }
  }, [isConnected, socketData, error, type]);

  // Use socket data if available and realtime is enabled
  const displayData = enableRealtime && socketData ? socketData : data.stats;
  const displayPercentages = enableRealtime && socketPercentages ? socketPercentages : percentages;
  const displayTotal = enableRealtime && socketData ? socketData.total : data.totalComments;

  const handleProgressUpdate = (sentiment: 'positive' | 'negative' | 'neutral') => 
    (newPercentage: number, newCount: number) => {
      // This callback will be useful for socket integration
      console.log(`${sentiment} updated:`, { newPercentage, newCount });
    };

  return (
    <div className={`w-full bg-white rounded-xl px-6 pt-12 shadow-md transition-all duration-300 relative flex-1`}>
      {/* Realtime indicator */}
      {enableRealtime && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      )}

      {/* Title and Total */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="text-3xl font-bold text-[#0846AA] mb-2">
          {displayTotal.toLocaleString()}
        </div>
        <p className="text-[#65758B] text-base">Total Comments</p>
        {enableRealtime && isConnected && (
          <div className="flex items-center justify-center mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
            <span className="text-xs text-green-600">Live Updates</span>
          </div>
        )}
      </div>

      {/* Progress Bars with enhanced features */}
      <div className="space-y-3">
        <ProgressBar
          type="positive"
          percentage={parseFloat(displayPercentages.positive)}
          count={displayData.positive}
          animate={true}
          onUpdate={enableRealtime ? handleProgressUpdate('positive') : undefined}
        />
        <ProgressBar
          type="negative"
          percentage={parseFloat(displayPercentages.negative)}
          count={displayData.negative}
          animate={true}
          onUpdate={enableRealtime ? handleProgressUpdate('negative') : undefined}
        />
        <ProgressBar
          type="neutral"
          percentage={parseFloat(displayPercentages.neutral)}
          count={displayData.neutral}
          animate={true}
          onUpdate={enableRealtime ? handleProgressUpdate('neutral') : undefined}
        />
      </div>

      {/* Socket connection status (for debugging) */}
      {enableRealtime && error && (
        <div className="mt-4 text-xs text-red-500">
          Socket Error: {error}
        </div>
      )}
    </div>
  );
};

export default StakeholderCard;