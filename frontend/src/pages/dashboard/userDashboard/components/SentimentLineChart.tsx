import React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import type { TrendData } from './dashboardData';

interface SentimentLineChartProps {
  data: TrendData[];
}

const SentimentLineChart: React.FC<SentimentLineChartProps> = ({ data }) => {
  // Extract data for chart
  const weeks = data.map(item => item.week);
  const positiveData = data.map(item => item.positive);
  const negativeData = data.map(item => item.negative);
  const neutralData = data.map(item => item.neutral);

  const margin = { right: 24, left: 40, top: 20, bottom: 40 };

  return (
    <Box sx={{ 
      width: '100%', 
      height: 350,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
      }
    }}>
      <LineChart
        series={[
          { 
            data: positiveData, 
            label: 'Positive',
            color: '#10b981', // emerald-500
            curve: 'linear'
          },
          { 
            data: negativeData, 
            label: 'Negative',
            color: '#ef4444', // red-500
            curve: 'linear'
          },
          { 
            data: neutralData, 
            label: 'Neutral',
            color: '#f59e0b', // amber-500
            curve: 'linear'
          },
        ]}
        xAxis={[{ 
          scaleType: 'point', 
          data: weeks,
          tickSize: 6,
          tickLabelStyle: {
            fontSize: 12,
            fill: '#64748b' // slate-500
          }
        }]}
        yAxis={[{ 
          width: 50,
          tickLabelStyle: {
            fontSize: 12,
            fill: '#64748b' // slate-500
          },
          min: 0,
          max: 80
        }]}
        margin={margin}
        grid={{ horizontal: true, vertical: false }}
        sx={{
          '& .MuiLineElement-root': {
            strokeWidth: 3,
            strokeDasharray: '0',
            animation: 'drawLine 2s ease-in-out',
            transition: 'all 0.3s ease',
            '&:hover': {
              strokeWidth: 4,
              filter: 'brightness(1.1)',
            },
          },
          '& .MuiMarkElement-root': {
            r: 4,
            strokeWidth: 2,
            fill: 'white',
            animation: 'fadeInScale 0.6s ease-out',
            animationFillMode: 'both',
            transition: 'all 0.2s ease',
            '&:hover': {
              r: 6,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              transform: 'scale(1.1)',
            },
          },
          '& .MuiChartsLegend-root': {
            fontSize: '14px',
            fontWeight: 500,
          },
          '@keyframes drawLine': {
            '0%': {
              strokeDasharray: '1000',
              strokeDashoffset: '1000',
            },
            '100%': {
              strokeDasharray: '1000',
              strokeDashoffset: '0',
            },
          },
          '@keyframes fadeInScale': {
            '0%': {
              opacity: 0,
              transform: 'scale(0)',
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1)',
            },
          },
        }}
      />
    </Box>
  );
};

export default SentimentLineChart;