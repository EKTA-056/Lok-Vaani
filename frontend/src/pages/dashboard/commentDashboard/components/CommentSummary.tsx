import React, { useMemo } from 'react';
import CommentCard from './CommentCard';
import type { CommentProps } from '@/types';
import type { Comment } from '@/services/commentService';
import Button from '@/components/common/Button';
import { MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommentSummary: React.FC<{ comments: Comment[] }> = ({ comments }) => {
  const navigate = useNavigate();
  
  // Only show the latest 5 comments, sorted by date descending
  // Map backend Comment to CommentProps for UI components
  const mappedComments = (comments || []).map((c: Comment): CommentProps => ({
    id: c.id,
    raw_comment: c.rawComment,
    language: c.language === null ? undefined : c.language,
    categoryType: c.company?.businessCategory?.name ?? '',
    bussiness_category: c.company?.businessCategory?.name ?? '',
    sentiment: c.sentiment,
    date: c.createdAt,
    state: c.status,
    summary: c.summary === null ? undefined : c.summary,
    company: c.company?.name ?? '',
    createdAt: c.createdAt,
    updatedAt: c.createdAt,
  }));

  const latestComments = useMemo(() => {
    return [...mappedComments]
      .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
      .slice(0, 5);
  }, [mappedComments]);

  return (
    <div className="bg-white items-center rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-sans">
            Latest Comments
          </h2>
          <p className="text-sm text-gray-600 font-sans">
            Only the 5 most recent comments are shown below.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4 text-sm text-gray-600">
          <span>Total: {comments.length}</span>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {latestComments.length > 0 ? (
          latestComments.map((comment) => (
            <CommentCard
              key={comment.id}
              raw_comment={comment.raw_comment}
              language={comment.language}
              categoryType={comment.categoryType}
              bussiness_category={comment.bussiness_category}
              sentiment={comment.sentiment}
              date={comment.date}
              summary={comment.summary}
              company={comment.company}
              updatedAt={comment.updatedAt}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg font-medium mb-2">No comments found</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          variant="secondary"
          className="w-1/5 max-w-xs"
          onClick={() => {
            // Navigate with comments data as state
            navigate('/drafts/comments-list', { 
              state: { 
                comments: mappedComments 
              } 
            });
          }}
        >
          <span className="flex items-center justify-center gap-2">
            View All Comments <MoveRight className='ml-2' />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default CommentSummary;