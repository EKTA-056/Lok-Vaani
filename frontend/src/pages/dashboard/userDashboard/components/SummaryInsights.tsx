import React from 'react';
import { FaceSmileIcon, ExclamationTriangleIcon, EyeIcon } from '@heroicons/react/24/outline';
import type { SummaryInsightsData } from './dashboardData';

interface SummaryInsightsProps {
  data: SummaryInsightsData;
}

const SummaryInsights: React.FC<SummaryInsightsProps> = ({ data }) => {
  // Function to highlight keywords in text
  const highlightKeywords = (text: string, type: 'positive' | 'negative' | 'neutral') => {
    const keywords = {
      positive: ['digital governance', 'transparency', 'efficiency', 'satisfaction', 'improvement', 'effective', 'excellent', 'appreciate'],
      negative: ['corruption', 'delays', 'inefficient', 'poor', 'lacking', 'issues', 'problems', 'concerned'],
      neutral: ['analysis', 'observation', 'noted', 'mentioned', 'reported', 'indicated', 'suggested']
    };

    const colorMap = {
      positive: 'text-green-700 font-semibold',
      negative: 'text-red-700 font-semibold',
      neutral: 'text-blue-700 font-semibold'
    };

    let highlightedText = text;
    keywords[type].forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="${colorMap[type]}">$1</span>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">
          Summary of All Comments
        </h3>
        <p className="text-sm text-gray-600 font-sans">
          AI-generated comprehensive overview
        </p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 mt-2 rounded-full"></div>
      </div>

      {/* Content Cards */}
      <div className="space-y-4">
        {/* Positive Feedback Highlights */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-3 font-sans">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm">
              <FaceSmileIcon className="h-5 w-5 text-white" />
            </div>
            Positive Feedback Highlights
          </h4>
          <div className="pl-2">
            <p className="text-sm text-gray-800 leading-relaxed font-sans">
              {highlightKeywords(data.positiveHighlights, 'positive')}
            </p>
          </div>
        </div>

        {/* Key Concerns Raised */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <h4 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-3 font-sans">
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm">
              <ExclamationTriangleIcon className="h-5 w-5 text-white" />
            </div>
            Key Concerns Raised
          </h4>
          <div className="pl-2">
            <p className="text-sm text-gray-800 leading-relaxed font-sans">
              {highlightKeywords(data.keyConcerns, 'negative')}
            </p>
          </div>
        </div>

        {/* Neutral Observations */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-3 font-sans">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <EyeIcon className="h-5 w-5 text-white" />
            </div>
            Neutral Observations
          </h4>
          <div className="pl-2">
            <p className="text-sm text-gray-800 leading-relaxed font-sans">
              {highlightKeywords(data.neutralObservations, 'neutral')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryInsights;