import React, { useState, useMemo } from 'react';
import CommentCard from './CommentCard';
import type { CommentData } from './dashboardData';

interface CommentSummaryProps {
  comments: CommentData[];
}

const CommentSummary: React.FC<CommentSummaryProps> = ({ comments }) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [stakeholderFilter, setStakeholderFilter] = useState<string>('all');

  // Filter comments based on selected filters
  const filteredComments = useMemo(() => {
    return comments.filter(comment => {
      const sentimentMatch = sentimentFilter === 'all' || comment.sentiment === sentimentFilter;
      const stakeholderMatch = stakeholderFilter === 'all' || comment.stakeholderType === stakeholderFilter;
      return sentimentMatch && stakeholderMatch;
    });
  }, [comments, sentimentFilter, stakeholderFilter]);

  // Get visible comments
  const visibleComments = filteredComments.slice(0, visibleCount);
  const hasMoreComments = visibleCount < filteredComments.length;

  // Reset visible count when filters change
  React.useEffect(() => {
    setVisibleCount(5);
  }, [sentimentFilter, stakeholderFilter]);

  const showMoreComments = () => {
    setVisibleCount(prev => Math.min(prev + 5, filteredComments.length));
  };

  const showLessComments = () => {
    setVisibleCount(5);
  };

  const getFilterButtonClass = (isActive: boolean) => {
    return `px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-sans">
            Comment Summary
          </h2>
          <p className="text-sm text-gray-600 font-sans">
            Detailed analysis of individual comments with expandable content
          </p>
        </div>
        
        {/* Summary stats */}
        <div className="mt-4 sm:mt-0 flex items-center gap-4 text-sm text-gray-600">
          <span>Total: {filteredComments.length}</span>
          <span>•</span>
          <span>
            Showing: {Math.min(visibleCount, filteredComments.length)}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {/* Sentiment Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sentiment:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSentimentFilter('all')}
              className={getFilterButtonClass(sentimentFilter === 'all')}
            >
              All
            </button>
            <button
              onClick={() => setSentimentFilter('positive')}
              className={getFilterButtonClass(sentimentFilter === 'positive')}
            >
              Positive
            </button>
            <button
              onClick={() => setSentimentFilter('negative')}
              className={getFilterButtonClass(sentimentFilter === 'negative')}
            >
              Negative
            </button>
            <button
              onClick={() => setSentimentFilter('neutral')}
              className={getFilterButtonClass(sentimentFilter === 'neutral')}
            >
              Neutral
            </button>
          </div>
        </div>

        {/* Stakeholder Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Stakeholder:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStakeholderFilter('all')}
              className={getFilterButtonClass(stakeholderFilter === 'all')}
            >
              All
            </button>
            <button
              onClick={() => setStakeholderFilter('Normal User')}
              className={getFilterButtonClass(stakeholderFilter === 'Normal User')}
            >
              Normal Users
            </button>
            <button
              onClick={() => setStakeholderFilter('Industrialist/Businessmen')}
              className={getFilterButtonClass(stakeholderFilter === 'Industrialist/Businessmen')}
            >
              Industrialists
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {visibleComments.length > 0 ? (
          visibleComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg font-medium mb-2">No comments found</p>
            <p className="text-sm">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Show More/Less Buttons */}
      {filteredComments.length > 0 && (
        <div className="flex items-center justify-center gap-4 mb-6">
          {hasMoreComments && (
            <button
              onClick={showMoreComments}
              className="px-8 py-3 rounded-lg text-white font-semibold text-lg shadow-lg 
        transition-all duration-300 hover:shadow-xl hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" style={{ background: 'linear-gradient(90deg, #4f46e5, #3b82f6)' }}
            >
              Show More Comments
              <span className="text-sm opacity-75">
                (+{Math.min(5, filteredComments.length - visibleCount)})
              </span>
            </button>
          )}
          
          {visibleCount > 5 && (
            <button
              onClick={showLessComments}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Show Less
            </button>
          )}
        </div>
      )}


    </div>
  );
};

export default CommentSummary;