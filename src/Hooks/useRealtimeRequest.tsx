'use client';

import { useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import { Request } from '@/interface';
import { useRequests } from '../context/RequestsContext.tsx';

export const useRealtimeRequests = (initialData: Request[]) => {
  const { requests, setRequests, addRequest } = useRequests();

  // أول تحميل للداتا من السيرفر
  useEffect(() => {
    setRequests(initialData);
  }, [initialData, setRequests]);

  // Realtime
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('requests-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'requests',
        },
        (payload) => {
          const newRequest = payload.new as Request;

          if (!newRequest.is_read) {
            addRequest(newRequest);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addRequest]);

  return requests;
};
