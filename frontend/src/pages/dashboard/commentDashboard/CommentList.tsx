import React, { useState, useMemo } from 'react';
import CommentCard from './components/CommentCard';
import { Search, Filter, Languages, Heart, Users, Calendar, RotateCcw, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import { useCommentSocketUpdates } from '../../../hooks/useCommentSocketUpdates';
import { type Comment } from '../../../services/commentService';

// Define the type for a comment object (should match CommentCard props)
export type CommentType = {
  id: string;
  raw_comment: string;
  language: string;
  categoryType: string;
  bussiness_category: string;
  sentiment: string;
  date?: string;
  state?: string;
  summary?: string;
  company: string;
  createdAt?: string;
  updatedAt?: string;
};

// Helper to extract unique string values for filters
function getUnique<T>(arr: T[], key: keyof T): string[] {
  return Array.from(new Set(arr.map(item => {
    const v = item[key];
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && v && 'name' in v) return v.name as string;
    return '';
  }).filter(Boolean)));
}

interface CommentListProps {
  comments?: CommentType[];
}

const CommentList: React.FC<CommentListProps> = ({ comments: propComments }) => {
  // Use props first, then fallback to navigation state, then Redux state
  const location = useLocation();
  const { comments: reduxComments, commentCounts } = useAppSelector(state => state.comment);

  // Initialize socket updates for real-time data
  const { isConnected, connections } = useCommentSocketUpdates({
    initialData: {
      positive: commentCounts?.positive || 0,
      negative: commentCounts?.negative || 0,
      neutral: commentCounts?.neutral || 0,
      total: commentCounts?.total || 0
    },
    autoConnect: true
  });

  // Map backend Comment to CommentType
  const mapCommentToCommentType = (c: Comment): CommentType => ({
    id: c.id,
    raw_comment: c.rawComment,
    language: c.language === null ? '' : c.language,
    categoryType: c.company?.businessCategory?.name ?? '',
    bussiness_category: c.company?.businessCategory?.name ?? '',
    sentiment: c.sentiment,
    date: c.createdAt,
    state: c.status,
    summary: c.summary === null ? undefined : c.summary,
    company: c.company?.name ?? '',
    createdAt: c.createdAt,
    updatedAt: c.createdAt,
  });
  
  const allComments: CommentType[] = useMemo(() => {
    const navigationComments = location.state?.comments || [];
    
    // Priority: props > navigation state > Redux state (with mapping)
    if (propComments && propComments.length > 0) {
      return propComments;
    } else if (navigationComments.length > 0) {
      return navigationComments;
    } else if (reduxComments && reduxComments.length > 0) {
      return reduxComments.map(mapCommentToCommentType);
    }
    return [];
  }, [propComments, location.state, reduxComments]);

  // Filter options
  const languages = ['Hindi', 'English', 'HinEnglish'];
  const sentiments = ['Positive', 'Negative', 'Neutral'];
  const categories = useMemo(() => getUnique(allComments, 'categoryType'), [allComments]);
  const businessCategories = [
    'Corporate Debtor',
    'Personal Guarantor to a Corporate Debtor',
    'Investors',
    'Insolvency Professional Entity',
    'Partnership firms',
    'Others',
    'Academics',
    'User',
    'Insolvency Professional Agency',
    'General',
    'Insolvency Professional',
    'Proprietorship firms',
    'Creditor to a Corporate Debtor'
  ];

  // Filter state
  const [language, setLanguage] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [category, setCategory] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Reset filter handler
  const handleResetFilters = () => {
    setLanguage('');
    setSentiment('');
    setCategory('');
    setBusinessCategory('');
    setSearch('');
    setDateFrom('');
    setDateTo('');
  };

  // Filtering logic
  const filteredComments: CommentType[] = useMemo(() => allComments.filter((comment: CommentType) => {
    // Date filter
    let dateValid = true;
    if (dateFrom) {
      dateValid = !!comment.createdAt && (new Date(comment.createdAt as string) >= new Date(dateFrom));
    }
    if (dateValid && dateTo) {
      dateValid = !!comment.createdAt && (new Date(comment.createdAt as string) <= new Date(dateTo));
    }
    return (
      (!language || (comment.language || '').toLowerCase() === language.toLowerCase()) &&
      (!sentiment || comment.sentiment === sentiment) &&
      (!category || (comment.categoryType || '').toUpperCase() === category.toUpperCase()) &&
      (!businessCategory || (comment.bussiness_category || '').toUpperCase() === businessCategory.toUpperCase()) &&
      (!search || (comment.raw_comment && comment.raw_comment.toLowerCase().includes(search.toLowerCase()))) &&
      dateValid
    );
  }), [allComments, language, sentiment, category, businessCategory, search, dateFrom, dateTo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-black">
                All Comments
              </h1>
              <p className="text-gray-600 text-sm mt-1">Filter and explore all feedback comments</p>
            </div>
            
            {/* Socket Status Indicator */}
            <div className="flex items-center gap-2 ml-auto">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className={`text-sm font-medium ${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {isConnected ? 'Live Updates' : 'Offline'}
              </span>
              {connections && (
                <span className="text-xs text-gray-500 ml-2">
                  ({Object.values(connections).filter(Boolean).length}/3 connected)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-white/80  backdrop-blur-md rounded-2xl shadow-md border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="text-blue-500" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Filter Options</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Comments</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by comment text..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Language Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <div className="relative">
                <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <select 
                  value={language} 
                  onChange={e => setLanguage(e.target.value)} 
                  className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                  <option value="">All Languages</option>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Sentiment Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <select 
                  value={sentiment} 
                  onChange={e => setSentiment(e.target.value)} 
                  className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                  <option value="">All Sentiments</option>
                  {sentiments.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Stakeholder Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Stakeholder</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <select 
                  value={businessCategory} 
                  onChange={e => setBusinessCategory(e.target.value)} 
                  className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                >
                  <option value="">All Stakeholders</option>
                  {businessCategories.map(bc => <option key={bc} value={bc}>{bc}</option>)}
                </select>
              </div>
            </div>

            {/* Date From */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Date To */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        {/* Comments Container */}
        <div className="space-y-6 bg-white rounded-md">
          {filteredComments.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center">
              <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 text-lg font-medium">No comments found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters to see more results</p>
            </div>
          ) : (
            filteredComments.map((comment: CommentType) => (
              <CommentCard
                key={comment.id}
                {...comment}
                sentiment={
                  comment.sentiment === 'Positive' || comment.sentiment === 'Negative' || comment.sentiment === 'Neutral'
                    ? comment.sentiment
                    : comment.sentiment?.toLowerCase() === 'positive' ? 'Positive'
                    : comment.sentiment?.toLowerCase() === 'negative' ? 'Negative'
                    : comment.sentiment?.toLowerCase() === 'neutral' ? 'Neutral'
                    : undefined
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentList;

// Usage example in parent:
// import CommentList, { CommentType } from './CommentList';
// <CommentList comments={mappedComments} />
