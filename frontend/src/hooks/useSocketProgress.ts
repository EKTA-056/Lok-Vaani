import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProgressData {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

interface SocketProgressPercentages {
  positive: string;
  negative: string;
  neutral: string;
}

interface UseSocketProgressProps {
  endpoint: string;
  eventName: string;
  initialData: SocketProgressData;
  autoConnect?: boolean;
}

interface UseSocketProgressReturn {
  isConnected: boolean;
  data: SocketProgressData | null;
  percentages: SocketProgressPercentages | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  refreshData: () => void;
}

export const useSocketProgress = ({
  endpoint,
  eventName,
  initialData,
  autoConnect = true // Enable auto-connect by default for global connection
}: UseSocketProgressProps): UseSocketProgressReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<SocketProgressData | null>(initialData);
  const [percentages, setPercentages] = useState<SocketProgressPercentages | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const isConnectingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Calculate percentages - memoized function to prevent re-creation
  const calculatePercentages = (socketData: SocketProgressData): SocketProgressPercentages => {
    const total = socketData.total || 1;
    return {
      positive: ((socketData.positive / total) * 100).toFixed(1),
      negative: ((socketData.negative / total) * 100).toFixed(1),
      neutral: ((socketData.neutral / total) * 100).toFixed(1)
    };
  };

  // Stable connect function
  const connect = () => {
    if (!isMountedRef.current || isConnectingRef.current || socketRef.current?.connected) {
      return;
    }

    isConnectingRef.current = true;

    try {
      socketRef.current = io(endpoint, {
        transports: ['polling', 'websocket'], // Try polling first, then websocket
        timeout: 20000,
        reconnection: false, // Disable automatic reconnection to prevent loops
        forceNew: true
      });

      socketRef.current.on('connect', () => {
        if (isMountedRef.current) {
          console.log('✅ [useSocketProgress] Socket connected successfully to:', endpoint);
          setIsConnected(true);
          setError(null);
          isConnectingRef.current = false;
        }
      });

      socketRef.current.on('disconnect', (reason: string) => {
        if (isMountedRef.current) {
          console.log('🔌 [useSocketProgress] Socket disconnected:', reason);
          setIsConnected(false);
          isConnectingRef.current = false;
        }
      });

      socketRef.current.on('connect_error', (err: Error) => {
        if (isMountedRef.current) {
          console.error('❌ [useSocketProgress] Socket connection error:', err.message);
          setError(`Connection failed: ${err.message}`);
          setIsConnected(false);
          isConnectingRef.current = false;
        }
      });

      // Event listeners for data updates - only listen to the specific event
      const handleDataUpdate = (socketData: SocketProgressData) => {
        if (isMountedRef.current) {
          console.log(`📊 [useSocketProgress] Received data from ${eventName}:`, socketData);
          setData(socketData);
          setPercentages(calculatePercentages(socketData));
        }
      };

      // Only listen to the specific event name requested
      socketRef.current.on(eventName, handleDataUpdate);
      
      // Also listen to comment-counts-update for backwards compatibility, but only for total-count-update
      if (eventName === 'total-count-update') {
        socketRef.current.on('comment-counts-update', handleDataUpdate);
      }

    } catch (err) {
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown socket error';
        console.error('❌ [useSocketProgress] Socket setup error:', errorMessage);
        setError(errorMessage);
        isConnectingRef.current = false;
      }
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (isMountedRef.current) {
      setIsConnected(false);
    }
    isConnectingRef.current = false;
  };

  const refreshData = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('refresh-sentiment-data', { eventName });
    }
  };

  // Initialize data and handle auto-connect
  useEffect(() => {
    isMountedRef.current = true;
    
    // Set initial data and percentages
    if (initialData) {
      setData(initialData);
      setPercentages(calculatePercentages(initialData));
    }

    // Auto-connect if enabled
    if (autoConnect) {
      const timeoutId = setTimeout(() => {
        connect();
      }, 100); // Small delay to ensure component is fully mounted

      return () => {
        clearTimeout(timeoutId);
      };
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      isConnectingRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once

  return {
    isConnected,
    data,
    percentages,
    error,
    connect,
    disconnect,
    refreshData
  };
};