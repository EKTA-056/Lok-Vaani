import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDownIcon,
  DocumentTextIcon,
  ClockIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

import { useAppSelector } from '@/hooks/redux';

interface Draft {
  id: string;
  title: string;
  description: string;
  postedDate: string;
  closingDate: string;
  category: string;
  status: 'Open' | 'Closed' | 'Upcoming';
  commentsCount: number;
  participants: number;
  analysisScore: number;
  pdfBase64?: string;
}

// Map API post to Draft shape
const mapPostToDraft = (post: any): Draft => ({
  id: post.id,
  title: post.title,
  description: post.description,
  postedDate: post.issueDate || post.createdAt || '',
  closingDate: post.deadline || post.updatedAt || '',
  category: post.postType || 'Other',
  status: post.status === 'Open' || post.status === 'Closed' || post.status === 'Upcoming' ? post.status : 'Open',
  commentsCount: post._count?.comments || 0,
  participants: post._count?.summaries || 0,
  analysisScore: 0, // Update if you have a field
  pdfBase64: post.pdfBase64 || undefined,
});

const Drafts: React.FC = () => {

  const { posts, loading } = useAppSelector(state => state.post);
  const drafts: Draft[] = useMemo(() => posts.map(mapPostToDraft), [posts]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [filteredDrafts, setFilteredDrafts] = useState<Draft[]>([]);

  // Helper functions
  const getDaysRemaining = (closingDate: string) => {
    const today = new Date();
    const closing = new Date(closingDate);
    const diffTime = closing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-red-100 text-red-800 border-red-200';
      case 'Upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <CheckCircleIcon className="h-3 w-3" />;
      case 'Closed': return <XCircleIcon className="h-3 w-3" />;
      case 'Upcoming': return <ClockIcon className="h-3 w-3" />;
      default: return <ClockIcon className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Corporate Law': 'bg-purple-100 text-purple-800',
      'Digital Governance': 'bg-blue-100 text-blue-800',
      'Environment': 'bg-green-100 text-green-800',
      'Business Policy': 'bg-orange-100 text-orange-800',
      'Financial Policy': 'bg-yellow-100 text-yellow-800',
      'Technology Policy': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Corporate Law': '⚖️',
      'Digital Governance': '💻',
      'Environment': '🌍',
      'Business Policy': '📊',
      'Financial Policy': '💰',
      'Technology Policy': '🔧'
    };
    return icons[category as keyof typeof icons] || '📄';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter and sort logic
  useEffect(() => {
    const filtered = drafts.filter(draft => {
      const matchesSearch = draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        draft.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || draft.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || draft.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort the filtered results
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'Newest':
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case 'Oldest':
          return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
        case 'Closing Soon':
          return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
        case 'Most Comments':
          return b.commentsCount - a.commentsCount;
        default:
          return 0;
      }
    });

    setFilteredDrafts(sorted);
  }, [drafts, searchTerm, selectedCategory, selectedStatus, sortBy]);

  // Get unique categories for filter dropdown - memoized to prevent recreation
  const categories = useMemo(() => ['All', ...Array.from(new Set(drafts.map(draft => draft.category)))], [drafts]);
  const statuses = ['All', 'Open', 'Closed', 'Upcoming'];

  // Active filters - memoized to prevent recreation
  const activeFilters = useMemo(() => [
    selectedCategory !== 'All' && selectedCategory,
    selectedStatus !== 'All' && selectedStatus,
    searchTerm && `Search: "${searchTerm}"`
  ].filter(Boolean), [selectedCategory, selectedStatus, searchTerm]);

  const navigate = useNavigate();
  const handleDraftClick = (draftId: string) => {
    // Navigate to the draft details page using path param
    navigate(`/drafts/comment-analysis/${draftId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Policy Drafts
              </h1>
              <div className="w-20 h-1 bg-blue-600 rounded-full mt-1"></div>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Review and analyze government draft policies and regulations open for public consultation. 
            Your feedback shapes the future of governance.
          </p>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-8">
          <div className="space-y-6">
            {/* Search Input */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Drafts</label>
              <div className="relative">
                {/* <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white hover:bg-gray-50 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sort Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full transition-all duration-200 cursor-pointer"
                  >
                    <option value="Newest">Newest First</option>
                    <option value="Oldest">Oldest First</option>
                    <option value="Closing Soon">Closing Soon</option>
                    <option value="Most Comments">Most Comments</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full transition-all duration-200 cursor-pointer"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'All' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="appearance-none bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full transition-all duration-200 cursor-pointer"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'All' ? 'All Status' : status}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Active Filters:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {activeFilters.map((filter, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    >
                      <span className="truncate max-w-[150px]">{filter}</span>
                      <button
                        onClick={() => {
                          if (filter === selectedCategory) setSelectedCategory('All');
                          if (filter === selectedStatus) setSelectedStatus('All');
                          if (typeof filter === 'string' && filter.startsWith('Search:')) setSearchTerm('');
                        }}
                        className="flex-shrink-0 hover:text-blue-900 transition-colors rounded-full p-0.5 hover:bg-blue-200"
                        aria-label={`Remove ${filter} filter`}
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setSelectedStatus('All');
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary and Stats */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredDrafts.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{drafts.length}</span> drafts
            </p>
            {activeFilters.length > 0 && (
              <p className="text-sm text-blue-600 mt-1">
                {activeFilters.length} filter{activeFilters.length > 1 ? 's' : ''} applied
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live updates</span>
            </div>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
              Last updated: {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>

        {/* Draft Cards List */}
        <div className="space-y-4 mb-12">
          {filteredDrafts.length === 0 ? (
            <>{loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mr-4"></div>
                <span className="text-blue-600 text-lg font-semibold">Loading drafts...</span>
              </div>
            )}
            {!loading && (
             <div className="text-center py-20">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No drafts found</h3>
                <p className="text-gray-600 max-w-md mx-auto">Try adjusting your search terms or filter criteria to find relevant draft policies.</p>
              </div>
            )}
            </>
          ) : (
            filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">

                    {/* Left Section - Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Status and Category Header */}
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(draft.status)}`}>
                          {getStatusIcon(draft.status)}
                          {draft.status}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium ${getCategoryColor(draft.category)}`}>
                          <span>{getCategoryIcon(draft.category)}</span>
                          <span>{draft.category}</span>
                        </span>
                        {draft.status === 'Open' && (
                          <span className="text-xs text-orange-600 font-medium">
                            {getDaysRemaining(draft.closingDate)} days left
                          </span>
                        )}
                      </div>

                      {/* Title and Description */}
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors cursor-pointer"
                          onClick={() => handleDraftClick(draft.id)}
                        >
                          {draft.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed line-clamp-2">
                          {draft.description}
                        </p>
                      </div>

                      {/* Timeline */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>Posted: {formatDate(draft.postedDate)}</span>
                        <span>•</span>
                        <span>Closes: {formatDate(draft.closingDate)}</span>
                      </div>

                      {/* Engagement Metrics */}
                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{draft.commentsCount.toLocaleString()}</span>
                          <span>comments</span>
                        </div>

                      </div>
                    </div>

                    {/* Right Section - Status & Actions */}
                    <div className="flex-shrink-0 flex lg:flex-col gap-3 lg:items-end">
                      {/* Progress Bar for Open Drafts */}
                      {/* {draft.status === 'Open' && (
                        <div className="hidden lg:block">
                          <div className="w-32 bg-gray-200 rounded-full h-1.5 mb-2">
                            <div
                              className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.max(15, Math.min(100, (getDaysRemaining(draft.closingDate) / 30) * 100))}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      )} */}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          className="w-10 h-10 inline-flex items-center justify-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                          title="Download Draft"
                          onClick={() => {
                            if (!draft.pdfBase64) {
                              alert('No PDF available for this draft.');
                              return;
                            }
                            // Decode base64 and trigger download
                            const byteCharacters = atob(draft.pdfBase64);
                            const byteNumbers = new Array(byteCharacters.length);
                            for (let i = 0; i < byteCharacters.length; i++) {
                              byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            const blob = new Blob([byteArray], { type: 'application/pdf' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${draft.title || 'draft'}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            setTimeout(() => {
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            }, 100);
                          }}
                        >
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredDrafts.length > 0 && filteredDrafts.length < drafts.length && (
          <div className="text-center pt-8">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md group">
              <span>Load More Drafts</span>
              <ChevronDownIcon className="h-4 w-4 group-hover:animate-bounce" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Showing {filteredDrafts.length} of {drafts.length} total drafts
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drafts;