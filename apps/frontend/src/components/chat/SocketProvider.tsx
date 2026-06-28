'use client';

import { useEffect } from 'react';
import { useSocketStore } from '@/store/useSocketStore';

export function SocketProvider({ token, children }: { token: string; children: React.ReactNode }) {
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    if (token) {
      connect(token);
    }
    
    return () => {
      disconnect();
    };
  }, [token, connect, disconnect]);

  return <>{children}</>;
}
