import { useAppSelector, useAppDispatch } from '../../../../hooks/redux';
import { updateSocketCommentCounts } from '../../../../store/slices/commentSlice';
import { useSocketProgress } from '../../../../hooks/useSocketProgress';
import { useEffect, useState } from 'react';
import { socketUrl } from '../../../../utils/baseApi';
export default function CommentHeading() {
  const { commentCounts } = useAppSelector(state => state.comment);
  const dispatch = useAppDispatch();
  const [liveData, setLiveData] = useState({
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0
  });
  
  // Initialize socket for real-time updates
  const { isConnected, data: socketData } = useSocketProgress({
    endpoint: `${socketUrl}`,
    eventName: 'total-count-update',
    initialData: {
      positive: commentCounts?.positive || 0,
      negative: commentCounts?.negative || 0,
      neutral: commentCounts?.neutral || 0,
      total: commentCounts?.total || 0
    },
    autoConnect: true
  }); 

  // Update Redux store when socket data changes
  useEffect(() => {
    if (socketData && isConnected) {
      dispatch(updateSocketCommentCounts(socketData));
    }
  }, [socketData, isConnected, dispatch]);

  // Update live data when socket data changes or Redux state changes
  useEffect(() => {
    if (socketData && isConnected) {
      setLiveData({
        total: socketData.total,
        positive: socketData.positive,
        negative: socketData.negative,
        neutral: socketData.neutral
      });
    } else if (commentCounts) {
      setLiveData({
        total: commentCounts.total || 0,
        positive: commentCounts.positive || 0,
        negative: commentCounts.negative || 0,
        neutral: commentCounts.neutral || 0
      });
    }
  }, [socketData, isConnected, commentCounts]);
  
  // Use live data for display
  const totalComments = liveData.total;
  const positiveComments = liveData.positive;
  const negativeComments = liveData.negative;
  const neutralComments = liveData.neutral;

  return (
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-[28px] font-semibold text-gray-500 tracking-widest">
              TOTAL COMMENTS ANALYZED
            </h1>
            {/* Socket Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className={`text-sm font-medium ${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="text-6xl font-bold text-[#0846AA] mb-2">
            {totalComments.toLocaleString()}
          </div>
          <p className="text-[#65758B] text-2xl">Comments Processed</p>
        </div>

        {/* Stats Cards in Row */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
          {/* Positive Comments Card */}
          <div className="flex flex-col justify-center text-center bg-white rounded-xl border-l-4 border-green-400 py-4 shadow-sm min-w-0 flex-1 max-w-sm">
            <h3 className="text-gray-700 font-medium text-lg">
                Positive Comments
            </h3>
            <span className="text-3xl font-bold text-[#0846AA] mt-4">
              {positiveComments.toLocaleString()}
            </span>
          </div>

          {/* Negative Comments Card */}
          <div className="flex flex-col justify-center text-center bg-white rounded-xl border-l-4 border-red-400 py-4 shadow-sm min-w-0 flex-1 max-w-sm">
            <h3 className="text-gray-700 font-medium text-lg">
                Negative Comments
            </h3>
            <span className="text-3xl font-bold text-[#0846AA] mt-4">
              {negativeComments.toLocaleString()}
            </span>
          </div>

          {/* Neutral Comments Card */}
          <div className="flex flex-col justify-center text-center bg-white rounded-xl border-l-4 border-yellow-400 py-4 shadow-sm min-w-0 flex-1 max-w-sm">
            <h3 className="text-gray-700 font-medium text-lg">
                Neutral Comments
            </h3>
            <span className="text-3xl font-bold text-[#0846AA] mt-4">
              {neutralComments.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
  );
}