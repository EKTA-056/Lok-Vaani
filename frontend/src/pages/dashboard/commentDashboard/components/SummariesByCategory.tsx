import React, { useState, useEffect, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
type SummaryData = {
  id: string; // Using a unique ID is better for keys
  category: string;
  summaryText: string;
  lastUpdated: string;
  updateType: 'Weekly' | 'Manual';
};

// --- MOCK DATA (Cleaned up and expanded) ---
const mockSummaries: SummaryData[] = [
  {
    id: 'sum_overall',
    category: 'Overall Summary',
    summaryText:
      'Public feedback highlights a strong consensus on the need for balanced regulation. While supportive voices endorse the draft, constructive criticism calls for greater clarity on enforcement and a deeper consideration of business impacts to ensure adaptability.',
    lastUpdated: '29-Sep-2025 09:00 AM',
    updateType: 'Weekly',
  },
  {
    id: 'sum_prof',
    category: 'By Professionals',
    summaryText:
      'Professionals, particularly from the legal and financial sectors, largely support the initiative but raise significant concerns about the ambiguity in Clause 5.2. They strongly suggest adding a more detailed framework for auditor certification to prevent misinterpretation and potential legal challenges.',
    lastUpdated: '29-Sep-2025 09:00 AM',
    updateType: 'Weekly',
  },
  {
    id: 'sum_corp',
    category: 'By Corporates',
    summaryText:
      'Corporate stakeholders are cautiously optimistic. Their feedback focuses on the potential for increased compliance burdens and recommends a phased rollout of the new rules to allow businesses adequate time to adapt their internal processes.',
    lastUpdated: '29-Sep-2025 09:00 AM',
    updateType: 'Weekly',
  },
  {
    id: 'sum_users',
    category: 'By Users',
    summaryText:
      "Individual users and consumer groups are overwhelmingly supportive, praising the draft's focus on consumer protection and data privacy. Their suggestions mainly involve strengthening penalties for non-compliance and improving transparency.",
    lastUpdated: '29-Sep-2025 09:00 AM',
    updateType: 'Weekly',
  },
  {
    id: 'sum_academics',
    category: 'By Academics',
    summaryText:
      'Academics emphasize the importance of empirical evaluation and recommend pilot programs to assess the draft’s real-world impact before full-scale implementation.',
    lastUpdated: '29-Sep-2025 09:00 AM',
    updateType: 'Weekly',
  },
  {
    id: 'sum_investors',
    category: 'By Investors',
    summaryText:
      'Investors express cautious optimism but seek more clarity on the draft’s implications for market stability and investment security, suggesting regular review mechanisms.',
    lastUpdated: '29-Sep-2025 09:00 AM',
    updateType: 'Weekly',
  },
  {
    id: 'sum_ngos',
    category: 'By NGOs',
    summaryText:
      'NGOs advocate for stronger safeguards for vulnerable groups and urge the inclusion of more robust grievance redressal mechanisms within the draft.',
    lastUpdated: '29-Sep-2025 09:00 AM',
    updateType: 'Weekly',
  },
  {
    id: 'sum_others',
    category: 'By Others',
    summaryText:
      'Other stakeholders, including small business owners and local bodies, highlight the need for simplified compliance procedures and greater outreach for awareness.',
    lastUpdated: '29-Sep-2025 09:00 AM',
    updateType: 'Weekly',
  },
];
// Note: I've shortened the summaryText for brevity in this example. Use your full text.


// --- Child Component for a Tab Button ---
interface TabButtonProps {
  category: string;
  isActive: boolean;
  onClick: (category: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ category, isActive, onClick }) => {
  const activeClasses = 'border-blue-600 text-blue-700 bg-blue-50';
  const inactiveClasses = 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-200';
  
  return (
    <button
      onClick={() => onClick(category)}
      className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-t-md
        ${isActive ? activeClasses : inactiveClasses}
      `}
      style={{ minWidth: '140px' }}
      aria-current={isActive ? 'page' : undefined}
    >
      {category}
    </button>
  );
};


// --- Main Optimized Component ---
const SummariesByCategory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // In a real app, you would fetch this from your backend
    setSummaries(mockSummaries);
    setActiveTab(mockSummaries[0]?.category || '');
  }, []);

  // Optimized: A single handler function for all tabs
  const handleTabClick = (category: string) => {
    setActiveTab(category);
  };

  const handleRefresh = () => {
    console.log(`Refreshing summary for: ${activeTab}`);
    setIsLoading(true);
    setTimeout(() => {
      const updatedSummaries = summaries.map(s => 
        s.category === activeTab 
        ? { ...s, summaryText: `(Refreshed) ${s.summaryText.replace('(Refreshed) ','')}`, lastUpdated: new Date().toLocaleString(), updateType: 'Manual' as const }
        : s
      );
      setSummaries(updatedSummaries);
      setIsLoading(false);
    }, 2000);
  };

  // Optimized: Memoize the result of the .find() operation
  const activeSummaryData = useMemo(() => 
    summaries.find(s => s.category === activeTab),
    [summaries, activeTab]
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-7xl mx-auto font-sans text-gray-900">
      <h2 className="text-xl font-bold mb-4 text-gray-800">AI-Generated Summaries by Category</h2>

      {/* Tab Navigation - with a fade effect to indicate scrollability */}
      <div className="relative border-b border-gray-200 mb-4">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100">
            <nav className="pb-[2px] flex space-x-4 min-w-max" aria-label="Tabs">
            {summaries.map((summary) => (
                <TabButton
                key={summary.id}
                category={summary.category}
                isActive={activeTab === summary.category}
                onClick={handleTabClick}
                />
            ))}
            </nav>
        </div>
        <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white pointer-events-none"></div>
      </div>


      {/* Summary Content Area */}
      <div className="relative min-h-[150px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 rounded-md z-10">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-700">Generating new summary, this may take a moment...</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 leading-relaxed">
              {activeSummaryData?.summaryText || 'No summary available.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between text-sm text-gray-500">
        <div>
          <span>Last updated: {activeSummaryData?.lastUpdated}</span>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${activeSummaryData?.updateType === 'Weekly' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
            {activeSummaryData?.updateType}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <svg className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4l-5 5M4 20l5-5" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default SummariesByCategory;