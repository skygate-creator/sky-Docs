// components/RequestsList/RequestsList.tsx
'use client';

import { useRealtimeRequests } from '../../Hooks/useRealtimeRequest';
import { Request } from '@/interface';
import RequestBox from '../RequestBox/RequestBox';

const RequestsList = ({ Requests }: { Requests: Request[] }) => {
  const requests = useRealtimeRequests(Requests);

  if (requests.length === 0) {
    return (
      <p className="text-center text-sm text-neutral-500 py-10">
        لا توجد طلبات جديدة حالياً
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {requests.map((req) => (
        <RequestBox key={req.id} request={req} />
      ))}
    </div>
  );
};

export default RequestsList;
