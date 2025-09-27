import { lazy, Suspense, useMemo } from 'react';

import GradientButton from './components/GradientButton';
import StatCard from './components/StatCard';
import { dashboardData, getCommentPercentages } from './components/dashboardData';

const SentimentBreakdown = lazy(() => import('./components/SentimentBreakdown'));
const SentimentAnalysis = lazy(() => import('./components/SentimentAnalysis'));
const SentimentByWeightage = lazy(() => import('./components/SentimentByWeightage'));
const WordCloud = lazy(() => import('./components/WordCloud'));
const CommentSummary = lazy(() => import('./components/CommentSummary'));
const AlertsSection = lazy(() => import('./components/AlertsSection'));
const OverallSummaryInsights = lazy(() => import('./components/OverallSummaryInsights'));

const SectionFallback = ({ label }: { label: string }) => (
  <div className="bg-white/60 border border-gray-100 rounded-xl p-10 text-center text-gray-500 animate-pulse">
    Loading {label}…
  </div>
);

const UserDashboard = () => {
  const percentages = useMemo(() => getCommentPercentages(dashboardData), []);

  const sentimentStats = useMemo(
    () => ([
      {
        type: 'positive' as const,
        count: dashboardData.stats.positive,
        percentage: percentages.positive,
      },
      {
        type: 'negative' as const,
        count: dashboardData.stats.negative,
        percentage: percentages.negative,
      },
      {
        type: 'neutral' as const,
        count: dashboardData.stats.neutral,
        percentage: percentages.neutral,
      },
    ]),
    [percentages]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Statistics Section - Single Horizontal Line */}
        <div className="flex flex-wrap items-stretch justify-between gap-6">
          
          {/* Total Comments Section */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-xl shadow-lg border border-blue-200/50 p-6 flex-1 min-w-[220px] hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-slate-100 hover:via-blue-100 hover:to-indigo-200 transition-all duration-300 cursor-pointer">
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

          {sentimentStats.map((stat) => (
            <div key={stat.type} className="flex-1 min-w-[220px]">
              <StatCard type={stat.type} count={stat.count} percentage={stat.percentage} />
            </div>
          ))}

        </div>

        {/* Visual Separator */}
        <div className="my-8">
          <div className="flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="px-4">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
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
            <Suspense fallback={<SectionFallback label="Sentiment breakdown" />}>
              <SentimentBreakdown />
            </Suspense>
          </div>

          <div className='mt-8'>
            {/* Sentiment Analysis & Trends Section */}
            <Suspense fallback={<SectionFallback label="Sentiment analysis" />}>
              <SentimentAnalysis />
            </Suspense>
          </div>
          
          <div className='mt-8'>
            {/* Sentiment Analysis by Weightage Section */}
            <Suspense fallback={<SectionFallback label="Sentiment by weightage" />}>
              <SentimentByWeightage />
            </Suspense>
          </div>
          
          <div className='mt-8'>
            {/* Word Cloud Section */}
            <Suspense fallback={<SectionFallback label="Word cloud" />}>
              <WordCloud />
            </Suspense>
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
            <Suspense fallback={<SectionFallback label="Comment summary" />}>
              <CommentSummary comments={dashboardData.comments} />
            </Suspense>
          </div>
          
          <div className='mt-8'>
              {/* Alerts Section */}
              <Suspense fallback={<SectionFallback label="Alerts" />}>
                <AlertsSection alerts={dashboardData.alerts} />
              </Suspense>
          </div>
         
          <div className='mt-8'>
              {/* Overall Summary and Insights Section */}
              <Suspense fallback={<SectionFallback label="Overall summary" />}>
                <OverallSummaryInsights data={dashboardData.insights} />
              </Suspense>
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