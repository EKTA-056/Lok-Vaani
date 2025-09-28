import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import type { CommentStats } from './dashboardData';

interface SentimentDonutChartProps {
  data: CommentStats;
  totalComments: number;
}

const SentimentDonutChart: React.FC<SentimentDonutChartProps> = ({ data, totalComments }) => {
  // Calculate percentages
  const positivePercentage = ((data.positive / totalComments) * 100).toFixed(1);
  const negativePercentage = ((data.negative / totalComments) * 100).toFixed(1);
  const neutralPercentage = ((data.neutral / totalComments) * 100).toFixed(1);

  // Prepare data for donut chart
  const chartData = [
    { 
      label: 'Positive', 
      value: data.positive, 
      color: '#10b981', // emerald-500
      percentage: positivePercentage
    },
    { 
      label: 'Negative', 
      value: data.negative, 
      color: '#ef4444', // red-500
      percentage: negativePercentage
    },
    { 
      label: 'Neutral', 
      value: data.neutral, 
      color: '#f59e0b', // amber-500
      percentage: neutralPercentage
    },
  ];

  const settings = {
    margin: { right: 5, left: 5, top: 5, bottom: 5 },
    width: 300,
    height: 300,
  };

  return (
    <div className="flex flex-col items-center">
      {/* Donut Chart */}
      <div className="mb-4 transition-transform duration-300 hover:scale-105">
        <PieChart
          series={[{ 
            innerRadius: 60, 
            outerRadius: 120, 
            data: chartData,
            highlightScope: {  },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          }]}
          {...settings}
          sx={{
            '& .MuiPieArc-root': {
              stroke: 'white',
              strokeWidth: 2,
              animation: 'expandArc 0.8s ease-out',
              transformOrigin: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                filter: 'brightness(1.1) drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
                strokeWidth: 3,
              },
            },
            '@keyframes expandArc': {
              '0%': {
                transform: 'scale(0)',
                opacity: 0,
              },
              '50%': {
                transform: 'scale(1.1)',
                opacity: 0.8,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-col space-y-3 w-full max-w-sm">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-sm mr-3"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-slate-700">
                {item.label}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentDonutChart;