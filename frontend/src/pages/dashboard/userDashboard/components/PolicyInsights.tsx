import React from 'react';
import { 
  ExclamationCircleIcon, 
  LightBulbIcon, 
  FireIcon, 
  ClockIcon, 
  ChartBarIcon
} from '@heroicons/react/24/outline';
import type { PolicyInsightsData } from './dashboardData';

interface PolicyInsightsProps {
  data: PolicyInsightsData;
}

const PolicyInsights: React.FC<PolicyInsightsProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans">
          Key Insights for Policymakers
        </h3>
        <p className="text-sm text-gray-600 font-sans">
          Strategic recommendations based on analysis
        </p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 mt-2 rounded-full"></div>
      </div>

      {/* Cards Grid Layout */}
      <div className="space-y-4">
        {/* High Priority Actions Card */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm">
              <FireIcon className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-red-800 font-sans">
              High Priority Actions
            </h4>
          </div>
          <div className="space-y-3">
            {data.highPriorityActions.map((action, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-red-100">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-800 leading-relaxed font-sans">
                  {action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Medium Priority Card */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-yellow-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg shadow-sm">
              <ClockIcon className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-amber-800 font-sans">
              Medium Priority
            </h4>
          </div>
          <div className="space-y-3">
            {data.mediumPriority.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-yellow-100">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-800 leading-relaxed font-sans">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Considerations Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
              <ChartBarIcon className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-blue-800 font-sans">
              Strategic Considerations
            </h4>
          </div>
          <div className="space-y-3">
            {data.strategicConsiderations.map((consideration, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-800 leading-relaxed font-sans">
                  {consideration}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row - Issues and Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Top Issues Card */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-100 border border-rose-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg shadow-sm">
                <ExclamationCircleIcon className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-bold text-rose-800 font-sans">
                Top Issues
              </h4>
            </div>
            <div className="space-y-2">
              {data.topIssuesRaised.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-800 font-sans">
                    {issue}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Suggestions Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-sm">
                <LightBulbIcon className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-bold text-emerald-800 font-sans">
                Top Suggestions
              </h4>
            </div>
            <div className="space-y-2">
              {data.topSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-800 font-sans">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyInsights;