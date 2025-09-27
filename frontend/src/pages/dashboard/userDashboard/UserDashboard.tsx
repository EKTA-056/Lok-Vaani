import GradientButton from './components/GradientButton';
import SentimentBreakdown from './components/SentimentBreakdown';
import SentimentAnalysis from './components/SentimentAnalysis';
import SentimentByWeightage from './components/SentimentByWeightage';
import WordCloud from './components/WordCloud';
import CommentSummary from './components/CommentSummary';
import AlertsSection from './components/AlertsSection';
import OverallSummaryInsights from './components/OverallSummaryInsights';
import { dashboardData, getCommentPercentages } from './components/dashboardData';

const UserDashboard = () => {
  const percentages = getCommentPercentages(dashboardData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Statistics Section - Single Horizontal Line */}
        <div className="flex items-center justify-between gap-6">
          
          {/* Total Comments Section */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-xl shadow-lg border border-blue-200/50 p-6 flex-1 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-slate-100 hover:via-blue-100 hover:to-indigo-200 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:from-blue-700 hover:to-purple-700">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-700 mb-2">
              {dashboardData.totalComments.toLocaleString()}
            </div>
            <div className="text-sm font-bold text-slate-800 mb-1">
              Total Comments Analyzed
            </div>
            <div className="text-xs text-slate-600">
              {dashboardData.commentsProcessed}
            </div>
          </div>

          {/* Positive Comments */}
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-xl shadow-lg border border-emerald-200/50 p-6 text-center flex-1 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-emerald-100 hover:via-green-100 hover:to-emerald-200 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-emerald-600 hover:scale-110">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-700 mb-2">
              {dashboardData.stats.positive.toLocaleString()}
            </div>
            <div className="text-sm font-bold text-emerald-800 mb-1">
              Positive Comments
            </div>
            <div className="text-xs text-emerald-600">
              {percentages.positive}% of total
            </div>
          </div>

          {/* Negative Comments */}
          <div className="bg-gradient-to-br from-rose-50 via-red-50 to-rose-100 rounded-xl shadow-lg border border-rose-200/50 p-6 text-center flex-1 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-rose-100 hover:via-red-100 hover:to-rose-200 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-rose-600 hover:scale-110">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-rose-700 mb-2">
              {dashboardData.stats.negative.toLocaleString()}
            </div>
            <div className="text-sm font-bold text-rose-800 mb-1">
              Negative Comments
            </div>
            <div className="text-xs text-rose-600">
              {percentages.negative}% of total
            </div>
          </div>

          {/* Neutral Comments */}
          <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-xl shadow-lg border border-amber-200/50 p-6 text-center flex-1 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-amber-100 hover:via-yellow-100 hover:to-amber-200 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-center mb-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-amber-600 hover:scale-110">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-700 mb-2">
              {dashboardData.stats.neutral.toLocaleString()}
            </div>
            <div className="text-sm font-bold text-amber-800 mb-1">
              Neutral Comments
            </div>
            <div className="text-xs text-amber-600">
              {percentages.neutral}% of total
            </div>
          </div>

        </div>

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
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-sans bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Summary of Feedback
            </h2>
            <p className="text-gray-600 font-sans max-w-2xl mx-auto">
              Comprehensive analysis and breakdown of public sentiment across different metrics
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-3 rounded-full"></div>
          </div>

          <div className='mt-8'>
            {/* Sentiment Breakdown Section */}
            <SentimentBreakdown />
          </div>
 
          <div className='mt-8'>
            {/* Sentiment Analysis & Trends Section */}
            <SentimentAnalysis />
          </div>
          
          <div className='mt-8'>
            {/* Sentiment Analysis by Weightage Section */}
            <SentimentByWeightage />
          </div>
          
          <div className='mt-8'>
            {/* Word Cloud Section */}
            <WordCloud />
          </div> 
        </div>

        {/* Visual Separator */}
        <div className="my-12">
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 font-sans bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Actionable Insights
            </h2>
            <p className="text-gray-600 font-sans max-w-2xl mx-auto">
              Critical alerts, comprehensive summaries, and strategic recommendations for informed decision-making
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-3 rounded-full"></div>
          </div>

          <div className='mt-8'>
            {/* Comment Summary Section */}
            <CommentSummary comments={dashboardData.comments} />
          </div>
          
          <div className='mt-8'>
              {/* Alerts Section */}
              <AlertsSection alerts={dashboardData.alerts} />
          </div>
         
          <div className='mt-8'>
              {/* Overall Summary and Insights Section */}
              <OverallSummaryInsights data={dashboardData.insights} />
          </div>
        </div>

        {/* Additional Actions Section */}
        <div className="text-center">
          <GradientButton>
            View Detailed Analysis
          </GradientButton>
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