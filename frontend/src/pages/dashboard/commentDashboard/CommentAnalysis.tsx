import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { useParams } from 'react-router-dom';
import SentimentBreakdown from './components/SentimentBreakdown';
import SentimentAnalysis from './components/SentimentAnalysis';
import WordCloud from './components/WordCloud';
import CommentHeading from './components/CommentHeading';
import { useEffect, useCallback } from 'react';
// import { useAuth } from '@/context/useAuth';
import { getCategoryCommentsCountAsync, getCommentsByPostIdAsync, getCommentsCountAsync, getCommentsWeightageAsync } from '@/store/slices/commentSlice';
import SummariesByCategory from './components/SummariesByCategory';
import { useCommentSocketUpdates } from '@/hooks/useCommentSocketUpdates';
import { AlertsSection, CommentSummary } from './components';

// Dummy data for alerts
const dashboardData = {
  alerts: [
    {
      id: '1',
      title: 'High Negative Sentiment Detected',
      description: 'Recent comments show increased negative sentiment. Immediate attention required.',
      count: 23,
      alertType: 'warning' as const
    },
    {
      id: '2',
      title: 'Processing Queue Status',
      description: 'Some comments are pending analysis due to high volume.',
      count: 8,
      alertType: 'info' as const
    }
  ]
};

const CommentAnalysis = () => {
  const dispatch = useAppDispatch();
  const { draftId } = useParams<{ draftId: string }>();
  
  // Get Redux state first
  const { 
    loading, 
    error, 
    comments,
    commentCounts,
    categoryCommentCounts
  } = useAppSelector(state => state.comment);
  
  // Use draftId as postId, with proper validation
  const postId = draftId;
  
  console.log('🔍 [CommentAnalysis] Redux State Debug:', {
    commentCounts,
    categoryCommentCounts,
    commentsLength: comments?.length || 0,
    postId,
    loading,
    error
  });

  // Initialize comprehensive socket connection for real-time updates
  const { isConnected, connections, errors, refreshAll } = useCommentSocketUpdates({
    initialData: {
      positive: commentCounts?.positive || 0,
      negative: commentCounts?.negative || 0,
      neutral: commentCounts?.neutral || 0,
      total: commentCounts?.total || 0
    },
    autoConnect: true
  });

  // Log socket connection status
  useEffect(() => {
    console.log('🌐 [CommentAnalysis] Socket connections:', connections);
    
    const errorList = Object.entries(errors)
      .filter(([, error]) => error)
      .map(([type, error]) => `${type}: ${error}`);
    
    if (errorList.length > 0) {
      console.error('🚨 [CommentAnalysis] Socket errors:', errorList);
    }
  }, [connections, errors]);
  
  // Create stable fetch function
  const fetchData = useCallback(() => {
    if (postId) {
      dispatch(getCommentsCountAsync(postId));
      dispatch(getCategoryCommentsCountAsync(postId));
      dispatch(getCommentsWeightageAsync(postId));
      dispatch(getCommentsByPostIdAsync(postId));
    }
  }, [dispatch, postId]);
  
  // Fetch data immediately when component mounts or postId changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Show loading for invalid postId
  if (!postId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] to-[#eaf1fb] font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Draft ID</h2>
          <p className="text-gray-600 mb-4">The draft you're looking for could not be found.</p>
        </div>
      </div>
    );
  }

  // Show loading state - always show loading when data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] to-[#eaf1fb] font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0846AA] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Dashboard Data...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching analytics for draft: {postId}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] to-[#eaf1fb] font-sans flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500 text-sm mb-4">Draft ID: {postId}</p>
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
    <div className=" bg-gradient-to-br from-[#f7fafd] to-[#eaf1fb] font-sans">
      {/* Executive Header */}
      <div className="bg-white  border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">LokVaani Analytics</h1>
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
                {isConnected && (
                  <button
                    onClick={refreshAll}
                    className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                  >
                    Refresh
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Stakeholder Sentiment Intelligence Platform</p>
            
          </div>
        </div>
      </div>
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Heading */}
          <CommentHeading />

          {/* Visual Separator */}
          <div className="my-6">
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

            <div className="grid grid-cols-1">
              {/* Sentiment Breakdown Section */}
              <SentimentBreakdown />

              {/* Sentiment Analysis & Trends Section */}
              <SentimentAnalysis />

              {/* Word Cloud Section */}
              <WordCloud />


           {/* Visual Separator */}
           <div className="my-2">
             <div className="flex items-center">
               <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
               <div className="px-6">
                 <div className="flex space-x-1">
                   <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                   <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                   <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                 </div>
               </div>
               <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
             </div>
           </div>

           {/* Actionable Insights Section */}
           <div className="mb-8">

             <div className='mt-8'>
               {/* Comment Summary Section */}
               <CommentSummary comments={comments} />
             </div>
            
             <div className='mt-8'>
                 {/* Alerts Section */}
                 <AlertsSection alerts={dashboardData.alerts} />
             </div>
          
             <div className='mt-8'>
                 {/* Overall Summary and Insights Section */}
                 <SummariesByCategory />
             </div>
           </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CommentAnalysis;


















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