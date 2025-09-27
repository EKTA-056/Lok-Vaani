import { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { useSocketProgress } from '../../../hooks/useSocketProgress';
import SentimentBreakdown from './components/SentimentBreakdown';
import SentimentAnalysis from './components/SentimentAnalysis';
import SentimentByWeightage from './components/SentimentByWeightage';
import WordCloud from './components/WordCloud';
import CommentHeading from './components/CommentHeading';

const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get Redux state
  const { 
    commentCounts, 
    loading, 
    error 
  } = useAppSelector(state => state.comment);

  // Memoize initial data to prevent object recreation on every render
  const initialSocketData = useMemo(() => ({
    positive: commentCounts?.positive || 0,
    negative: commentCounts?.negative || 0,
    neutral: commentCounts?.neutral || 0,
    total: commentCounts?.total || 0
  }), [commentCounts?.positive, commentCounts?.negative, commentCounts?.neutral, commentCounts?.total]);

  // Socket connection for real-time updates
  const {
    isConnected: socketConnected,
    data: socketData,
    error: socketError,
    refreshData,
    connect: connectSocket
  } = useSocketProgress({
    endpoint: 'http://localhost:4000',
    eventName: 'sentiment-update',
    initialData: initialSocketData,
    autoConnect: false // Disable auto-connect to prevent loops
  });

  // Connect socket manually only once after data is loaded
  useEffect(() => {
    console.log('🚀 [UserDashboard] Connecting socket...');
    connectSocket();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency - run only once

  // ...existing code...

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Use socket data if available, otherwise fallback to Redux data
  const displayData = socketData || {
    positive: commentCounts?.positive || 0,
    negative: commentCounts?.negative || 0,
    neutral: commentCounts?.neutral || 0,
    total: commentCounts?.total || 0
  };

  // Show loading state
  if (loading && !commentCounts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] to-[#eaf1fb] font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0846AA] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Dashboard Data...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching real-time sentiment analytics</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !commentCounts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] to-[#eaf1fb] font-sans flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#0846AA] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] to-[#eaf1fb] font-sans">
      {/* Executive Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">LokVaani Analytics</h1>
            <p className="text-sm text-gray-500 mb-4">Real-time Stakeholder Sentiment Intelligence Platform</p>
            
            {/* Status & Time */}
            <div className="flex justify-center items-center space-x-8 mt-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  socketConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-600">
                  {socketConnected ? 
                    (loading ? 'Live + Updating...' : 'Live Data') : 
                    (loading ? 'Updating Data...' : 'Cached Data')
                  }
                </span>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {formatDate(currentTime)}
                </div>
                <div className="text-base font-bold text-[#0846AA] font-mono">
                  {formatTime(currentTime)}
                </div>
              </div>
              {/* Data Summary */}
              <div className="text-center">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Total Comments
                </div>
                <div className="text-base font-bold text-[#0846AA]">
                  {displayData.total}
                </div>
              </div>
              {/* Socket Status */}
              {socketError && (
                <div className="text-center">
                  <div className="text-xs font-medium text-red-500 uppercase tracking-wide">
                    Socket Error
                  </div>
                  <button
                    onClick={refreshData}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Retry Connection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Heading */}
          <CommentHeading />

          {/* Visual Separator */}
          <div className="my-12">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
              <div className="px-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
            </div>
          </div>

          {/* Summary of Feedback Section */}
          <section className="mb-14">

            <div className="grid grid-cols-1 gap-10">
              {/* Sentiment Breakdown Section */}
              <SentimentBreakdown />

              {/* Sentiment Analysis & Trends Section */}
              <SentimentAnalysis />

              {/* Sentiment Analysis by Weightage Section */}
              <SentimentByWeightage />

              {/* Word Cloud Section */}
              <WordCloud />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;


















          // {/* Visual Separator */}
          // <div className="my-12">
          //   <div className="flex items-center">
          //     <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          //     <div className="px-6">
          //       <div className="flex space-x-1">
          //         <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
          //         <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
          //         <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
          //       </div>
          //     </div>
          //     <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          //   </div>
          // </div>

          // {/* Actionable Insights Section */}
          // <div className="mb-8">
          //   <div className="text-center mb-8">
          //     <h2 className="text-3xl font-bold text-gray-900 mb-3 font-sans bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          //       Actionable Insights
          //     </h2>
          //     <p className="text-gray-600 font-sans max-w-2xl mx-auto">
          //       Critical alerts, comprehensive summaries, and strategic recommendations for informed decision-making
          //     </p>
          //     <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-3 rounded-full"></div>
          //   </div>

          //   <div className='mt-8'>
          //     {/* Comment Summary Section */}
          //     <CommentSummary comments={dashboardData.comments} />
          //   </div>
            
          //   <div className='mt-8'>
          //       {/* Alerts Section */}
          //       <AlertsSection alerts={dashboardData.alerts} />
          //   </div>
          
          //   <div className='mt-8'>
          //       {/* Overall Summary and Insights Section */}
          //       <OverallSummaryInsights data={dashboardData.insights} />
          //   </div>
          // </div>

          // {/* Additional Actions Section */}
          // <div className="text-center">
          //   <GradientButton>
          //     View Detailed Analysis
          //   </GradientButton>
          // </div>