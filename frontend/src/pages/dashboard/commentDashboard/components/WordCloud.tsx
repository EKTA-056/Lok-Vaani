import { Header } from '@/components/common/Header';
import React from 'react';

const WordCloud: React.FC = () => {
  return (
    <div className="rounded-xl p-8 border border-gray-100 transition-shadow duration-300">
      {/* Section Header */}
      <Header text={"WordCloud"} />

      {/* Word Cloud Container */}
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300">
          {/* Word Cloud Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <img 
                src="/assets/word_cloud.png" 
                alt="Word Cloud Analysis - Most frequently used words in comments"
                className="w-full h-auto rounded-lg shadow-sm"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>
          </div>
          
          {/* Optional Description */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-sans">
              Visual representation of the most frequently used words in analyzed comments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCloud;