import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  type: 'positive' | 'negative' | 'neutral';
  percentage: number;
  count: number;
  animate?: boolean;
  onUpdate?: (newPercentage: number, newCount: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  type, 
  percentage, 
  count, 
  animate = true,
  onUpdate 
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(animate ? 0 : percentage);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setDisplayPercentage(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayPercentage(percentage);
    }
  }, [percentage, animate]);

  const getBarConfig = () => {
    switch (type) {
      case 'positive':
        return {
          label: 'Positive',
          bgColor: 'bg-emerald-100',
          textColor: 'text-emerald-700',
          indicatorColor: 'bg-gradient-to-r from-emerald-400 to-green-500',
        };
      case 'negative':
        return {
          label: 'Negative',
          bgColor: 'bg-rose-100',
          textColor: 'text-rose-700',
          indicatorColor: 'bg-gradient-to-r from-rose-400 to-red-500',
        };
      case 'neutral':
        return {
          label: 'Neutral',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-700',
          indicatorColor: 'bg-gradient-to-r from-amber-400 to-yellow-500',
        };
    }
  };

  const config = getBarConfig();

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-3">
        <span className={cn("font-semibold", config.textColor)}>
          {config.label}
        </span>
        <span className={cn("font-bold text-sm", config.textColor)}>
          {count.toLocaleString()} ({displayPercentage.toFixed(0)}%)
        </span>
      </div>
      
      {/* Using shadcn/ui Progress component for better socket integration */}
      <Progress 
        value={displayPercentage} 
        className={cn("h-2 w-full", config.bgColor)}
        indicatorClassName={cn("shadow-sm", config.indicatorColor)}
      />
      
      {/* Optional: Socket connection status indicator */}
      {onUpdate && (
        <div className="flex items-center mt-1">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse mr-1"></div>
          <span className="text-xs text-gray-500">Live updates enabled</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;