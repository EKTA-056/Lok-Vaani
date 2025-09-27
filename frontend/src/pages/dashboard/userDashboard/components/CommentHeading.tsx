import { useAppSelector } from '../../../../hooks/redux';

export default function CommentHeading() {
  const { commentCounts } = useAppSelector(state => state.comment);
  
  // Use real data or fallback to default values
  const totalComments = commentCounts?.total || 0;
  const positiveComments = commentCounts?.positive || 0;
  const negativeComments = commentCounts?.negative || 0;
  const neutralComments = commentCounts?.neutral || 0;

  return (
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-[28px] font-semibold text-gray-500 mb-4 tracking-widest">
            TOTAL COMMENTS ANALYZED
          </h1>
          <div className="text-6xl font-bold text-[#0846AA] mb-2">
            {totalComments.toLocaleString()}
          </div>
          <p className="text-[#65758B] text-2xl">Comments Processed</p>
        </div>

        {/* Stats Cards in Row */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
          {/* Positive Comments Card */}
          <div className="flex flex-col justify-center text-center bg-white rounded-xl border-l-4 border-green-400 py-4 shadow-sm min-w-0 flex-1 max-w-sm">
            <h3 className="text-gray-700 font-medium text-lg">
                Positive Comments
            </h3>
            <span className="text-3xl font-bold text-[#0846AA] mt-4">
              {positiveComments.toLocaleString()}
            </span>
          </div>

          {/* Negative Comments Card */}
          <div className="flex flex-col justify-center text-center bg-white rounded-xl border-l-4 border-red-400 py-4 shadow-sm min-w-0 flex-1 max-w-sm">
            <h3 className="text-gray-700 font-medium text-lg">
                Negative Comments
            </h3>
            <span className="text-3xl font-bold text-[#0846AA] mt-4">
              {negativeComments.toLocaleString()}
            </span>
          </div>

          {/* Neutral Comments Card */}
          <div className="flex flex-col justify-center text-center bg-white rounded-xl border-l-4 border-yellow-400 py-4 shadow-sm min-w-0 flex-1 max-w-sm">
            <h3 className="text-gray-700 font-medium text-lg">
                Neutral Comments
            </h3>
            <span className="text-3xl font-bold text-[#0846AA] mt-4">
              {neutralComments.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
  );
}