import React from 'react';
import ProgressBar from './ProgressBar';
import { getStakeholderPercentages } from './dashboardData';
import type { StakeholderData } from './dashboardData';
// import { useSocketProgress } from '@/hooks/useSocketProgress'; // Uncomment when socket is ready

interface StakeholderCardProps {
  title: string;
  data: StakeholderData;
  type: 'normal' | 'industrialist';
  enableRealtime?: boolean;
}

const StakeholderCard: React.FC<StakeholderCardProps> = ({ 
  title, 
  data, 
  enableRealtime = false 
}) => {
  const percentages = getStakeholderPercentages(data);

  // Socket integration (ready for when you implement backend socket)
  // const {
  //   isConnected,
  //   data: socketData,
  //   percentages: socketPercentages,
  //   error
  // } = useSocketProgress({
  //   endpoint: 'http://localhost:3001',
  //   eventName: `${type}-sentiment-update`,
  //   initialData: {
  //     positive: data.stats.positive,
  //     negative: data.stats.negative,
  //     neutral: data.stats.neutral,
  //     total: data.totalComments
  //   }
  // });

  // Use socket data if available and realtime is enabled
  // const displayData = enableRealtime && socketData ? socketData : data.stats;
  // const displayPercentages = enableRealtime && socketPercentages ? socketPercentages : percentages;

  const handleProgressUpdate = (sentiment: 'positive' | 'negative' | 'neutral') => 
    (newPercentage: number, newCount: number) => {
      // This callback will be useful for socket integration
      console.log(`${sentiment} updated:`, { newPercentage, newCount });
    };

  return (
    <div className={`w-full bg-white rounded-xl p-6 shadow-md transition-all duration-300 relative flex-1`}>
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
          {data.totalComments.toLocaleString()}
        </div>
        <p className="text-[#65758B] text-base">Total Comments</p>
      </div>

      {/* Progress Bars with enhanced features */}
      <div className="space-y-3">
        <ProgressBar
          type="positive"
          percentage={parseFloat(percentages.positive)}
          count={data.stats.positive}
          animate={true}
          onUpdate={enableRealtime ? handleProgressUpdate('positive') : undefined}
        />
        <ProgressBar
          type="negative"
          percentage={parseFloat(percentages.negative)}
          count={data.stats.negative}
          animate={true}
          onUpdate={enableRealtime ? handleProgressUpdate('negative') : undefined}
        />
        <ProgressBar
          type="neutral"
          percentage={parseFloat(percentages.neutral)}
          count={data.stats.neutral}
          animate={true}
          onUpdate={enableRealtime ? handleProgressUpdate('neutral') : undefined}
        />
      </div>

      {/* Socket connection status (for debugging) */}
      {/* enableRealtime && error && (
        <div className="mt-4 text-xs text-red-500">
          Socket Error: {error}
        </div>
      ) */}
    </div>
  );
};

export default StakeholderCard;