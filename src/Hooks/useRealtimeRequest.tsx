// hooks/useRealtimeRequests.ts
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { Request } from '@/interface';

export const useRealtimeRequests = (initialData: Request[]) => {
  const [requests, setRequests] = useState<Request[]>(initialData);

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
            setRequests((prev) => [newRequest, ...prev]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialData]);

  return requests;
};
