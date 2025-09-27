import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import type { CommentData } from './dashboardData';

interface CommentCardProps {
  comment: CommentData;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getSentimentColor(comment.sentiment)}`}>
      {/* Header with sentiment badge and expand button */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentBadgeColor(comment.sentiment)}`}>
            {comment.sentiment.charAt(0).toUpperCase() + comment.sentiment.slice(1)}
          </span>
          <span className="text-xs text-gray-500">
            Confidence: {(comment.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
          {isExpanded ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Summary */}
      <div className="mb-3">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{comment.summary}</p>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
        <div>
          <span className="font-medium text-gray-600">Company:</span>
          <p className="text-gray-800 mt-1">{comment.company}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Category:</span>
          <p className="text-gray-800 mt-1">{comment.category}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Language:</span>
          <p className="text-gray-800 mt-1">{comment.language}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Date:</span>
          <p className="text-gray-800 mt-1">{formatDate(comment.date)}</p>
        </div>
      </div>

      {/* Stakeholder type and tags */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs font-medium text-gray-600">Stakeholder:</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {comment.stakeholderType}
        </span>
        {comment.tags.length > 0 && (
          <>
            <span className="text-xs font-medium text-gray-600 ml-2">Tags:</span>
            {comment.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </>
        )}
      </div>

      {/* Expandable full content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Full Content {comment.language !== 'English' && `(${comment.language})`}
            </h4>
            <div className="bg-white rounded-md p-3 border border-gray-200">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {comment.fullContent}
              </p>
            </div>
          </div>
          
          {/* English Translation for non-English comments */}
          {comment.englishTranslation && comment.language !== 'English' && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                English Translation
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                  Auto-translated
                </span>
              </h4>
              <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
                <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">
                  {comment.englishTranslation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;