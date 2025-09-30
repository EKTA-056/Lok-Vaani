import { useEffect } from 'react';
import { useAppDispatch } from './redux';
import { updateSocketCommentCounts, updateSocketCategoryData } from '../store/slices/commentSlice';
import { useSocketProgress } from './useSocketProgress';
import { socketUrl } from '@/utils/baseApi';

interface CommentCounts {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

interface UseCommentSocketUpdatesProps {
  initialData: CommentCounts;
  autoConnect?: boolean;
}

export const useCommentSocketUpdates = ({ 
  initialData, 
  autoConnect = true 
}: UseCommentSocketUpdatesProps) => {
  const dispatch = useAppDispatch();

  // Main sentiment updates
  const mainSocket = useSocketProgress({
    endpoint: `${socketUrl}`,
    eventName: 'total-count-update',
    initialData,
    autoConnect
  });

  // Normal user sentiment updates
  const normalSocket = useSocketProgress({
    endpoint: `${socketUrl}`,
    eventName: 'normal-count-update',
    initialData,
    autoConnect
  });

  // Industrialist sentiment updates
  const industrialistSocket = useSocketProgress({
    endpoint: `${socketUrl}`,
    eventName: 'industrialist-count-update',
    initialData,
    autoConnect
  });

  // Update Redux state when main socket data changes
  useEffect(() => {
    if (mainSocket.data && mainSocket.isConnected) {
      console.log('🔄 [useCommentSocketUpdates] Updating main comment counts:', mainSocket.data);
      dispatch(updateSocketCommentCounts(mainSocket.data));
    }
  }, [mainSocket.data, mainSocket.isConnected, dispatch]);

  // Update Redux state when normal user socket data changes
  useEffect(() => {
    if (normalSocket.data && normalSocket.isConnected) {
      console.log('🔄 [useCommentSocketUpdates] Updating normal user data:', normalSocket.data);
      dispatch(updateSocketCategoryData({
        type: 'normal',
        data: normalSocket.data
      }));
    }
  }, [normalSocket.data, normalSocket.isConnected, dispatch]);

  // Update Redux state when industrialist socket data changes
  useEffect(() => {
    if (industrialistSocket.data && industrialistSocket.isConnected) {
      console.log('🔄 [useCommentSocketUpdates] Updating industrialist data:', industrialistSocket.data);
      dispatch(updateSocketCategoryData({
        type: 'industrialist',
        data: industrialistSocket.data
      }));
    }
  }, [industrialistSocket.data, industrialistSocket.isConnected, dispatch]);

  // Log connection status
  useEffect(() => {
    const connections = {
      main: mainSocket.isConnected,
      normal: normalSocket.isConnected,
      industrialist: industrialistSocket.isConnected
    };
    
    console.log('🌐 [useCommentSocketUpdates] Socket connections:', connections);
    
    const errors = [
      mainSocket.error && `Main: ${mainSocket.error}`,
      normalSocket.error && `Normal: ${normalSocket.error}`,
      industrialistSocket.error && `Industrialist: ${industrialistSocket.error}`
    ].filter(Boolean);
    
    if (errors.length > 0) {
      console.error('🚨 [useCommentSocketUpdates] Socket errors:', errors);
    }
  }, [
    mainSocket.isConnected, normalSocket.isConnected, industrialistSocket.isConnected,
    mainSocket.error, normalSocket.error, industrialistSocket.error
  ]);

  return {
    isConnected: mainSocket.isConnected || normalSocket.isConnected || industrialistSocket.isConnected,
    connections: {
      main: mainSocket.isConnected,
      normal: normalSocket.isConnected,
      industrialist: industrialistSocket.isConnected
    },
    errors: {
      main: mainSocket.error,
      normal: normalSocket.error,
      industrialist: industrialistSocket.error
    },
    refreshAll: () => {
      mainSocket.refreshData();
      normalSocket.refreshData();
      industrialistSocket.refreshData();
    }
  };
};