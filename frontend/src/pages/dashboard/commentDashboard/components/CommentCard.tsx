import React from 'react';
import { ThumbsUp, ChevronDown, ThumbsDown, Equal } from 'lucide-react';
import type { CommentProps } from '@/types';



const CommentCard: React.FC<CommentProps> = ({
  raw_comment,
  categoryType,
  bussiness_category,
  sentiment,
  language,
  summary,
  company,
  updatedAt
}) => {

  const getCategoryColor = (category: string) => {
    switch ((category || '').toUpperCase()) {
      case 'USER':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'BUSINESS':
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const [expanded, setExpanded] = React.useState(false);
  const handleToggle = () => setExpanded((prev) => !prev);

  // Language color coding
  const getLanguageColor = (lang: string) => {
    switch ((lang || '').toLowerCase()) {
      case 'hindi':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'english':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'hinenglish':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Safely parse updatedAt for date and time
  let datePart = updatedAt;
  let timePart = '';
  if (updatedAt && updatedAt.includes('T')) {
    const [date, time] = updatedAt.split('T');
    datePart = date;
    if (time) {
      timePart = time.split('.')[0];
    }
  }

  // Choose icon and color for sentiment using switch
  let SentimentIcon = ThumbsUp;
  let iconBg = 'bg-green-100';
  let iconColor = 'text-green-600';
  switch (sentiment) {
    case 'Negative':
      SentimentIcon = ThumbsDown;
      iconBg = 'bg-red-100';
      iconColor = 'text-red-600';
      break;
    case 'Neutral':
      SentimentIcon = Equal;
      iconBg = 'bg-gray-100';
      iconColor = 'text-gray-600';
      break;
    case 'Positive':
    default:
      SentimentIcon = ThumbsUp;
      iconBg = 'bg-green-100';
      iconColor = 'text-green-600';
      break;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white border border-gray-100 rounded-xl px-6 py-5 shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="flex flex-row items-center gap-4 w-full">
          {/* Icon */}
          <div className="flex flex-col items-center pt-1">
            <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center shadow-sm`}>
              <SentimentIcon className={`w-5 h-5 ${iconColor}`} />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-row items-center justify-between gap-2 mb-1">
              <div className="flex flex-row gap-2 items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getLanguageColor(language || '')}`}>{language}</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(categoryType || '')}`}>{categoryType}</span>
              </div>
              <div className="flex flex-row items-center gap-2">
                <span className="text-sm font-semibold text-blue-700">{datePart}</span>
                {timePart && <><span className="text-sm font-semibold text-blue-400">|</span><span className="text-sm font-semibold text-blue-700">{timePart}</span></>}
                <button
                  className={`ml-2 p-1 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors duration-150 shadow-sm flex items-center justify-center ${expanded ? 'ring-2 ring-blue-300' : ''}`}
                  onClick={handleToggle}
                  aria-label={expanded ? 'Collapse' : 'Expand'}
                >
                  <ChevronDown className={`w-4 h-4 text-blue-600 transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
            <div className="mb-2">
              <p
                className={`text-gray-900 text-base font-medium leading-relaxed transition-all duration-200 ${expanded ? '' : 'line-clamp-2'}`}
                style={!expanded ? { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}}
              >
                {raw_comment}
              </p>
              {expanded && summary && (
                <div className="mt-3 px-4 py-2 bg-blue-50 border-l-4 border-blue-400 rounded-md">
                  <span className="block text-blue-900 text-sm font-semibold mb-1">Summary</span>
                  <span className="text-blue-900 text-sm leading-relaxed">{summary}</span>
                </div>
              )}
            </div>
            <div className="flex flex-row items-center gap-2 mt-1">
              <span className="text-gray-500 text-sm font-medium truncate">{company}</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 text-sm font-medium truncate">{bussiness_category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;