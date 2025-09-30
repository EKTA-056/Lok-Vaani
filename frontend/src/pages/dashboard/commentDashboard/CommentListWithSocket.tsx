import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import CommentList, { type CommentType } from './CommentList';
import { type Comment } from '../../../services/commentService';
import { useCommentSocketUpdates } from '../../../hooks/useCommentSocketUpdates';

// Map backend Comment to CommentType for UI components
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

const CommentListWithSocket: React.FC = () => {
  const location = useLocation();
  const { comments: reduxComments, commentCounts } = useAppSelector(state => state.comment);
  const [comments, setComments] = useState<CommentType[]>([]);

  // Initialize socket updates
  const { isConnected, connections } = useCommentSocketUpdates({
    initialData: {
      positive: commentCounts?.positive || 0,
      negative: commentCounts?.negative || 0,
      neutral: commentCounts?.neutral || 0,
      total: commentCounts?.total || 0
    },
    autoConnect: true
  });

  // Handle navigation state (comments passed from CommentSummary)
  useEffect(() => {
    const navigationComments = location.state?.comments as CommentType[];
    
    if (navigationComments && navigationComments.length > 0) {
      console.log('📍 [CommentListWithSocket] Using navigation state comments:', navigationComments.length);
      setComments(navigationComments);
    } else if (reduxComments && reduxComments.length > 0) {
      console.log('🔄 [CommentListWithSocket] Using Redux comments:', reduxComments.length);
      const mappedComments = reduxComments.map(mapCommentToCommentType);
      setComments(mappedComments);
    } else {
      console.log('⚠️ [CommentListWithSocket] No comments available');
      setComments([]);
    }
  }, [location.state, reduxComments]);

  // Update comments when Redux state changes (socket updates)
  useEffect(() => {
    if (reduxComments && reduxComments.length > 0 && !location.state?.comments) {
      console.log('🔄 [CommentListWithSocket] Updating from Redux (socket update):', reduxComments.length);
      const mappedComments = reduxComments.map(mapCommentToCommentType);
      setComments(mappedComments);
    }
  }, [reduxComments, location.state]);

  return (
    <>
      {/* Socket Status Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-4">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Real-time Comments</h2>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}></div>
                <span className={`text-sm font-medium ${
                  isConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isConnected ? 'Live Updates' : 'Offline'}
                </span>
              </div>
            </div>
            
            {/* Connection Details */}
            <div className="text-sm text-gray-500">
              <span>Total: {comments.length}</span>
              {connections && (
                <span className="ml-4">
                  Connections: {Object.values(connections).filter(Boolean).length}/3
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comment List */}
      <CommentList comments={comments} />
    </>
  );
};

export default CommentListWithSocket;