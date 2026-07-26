import { Request } from '@/interface';
import RequestAnlaysesCard from '../RequestAnlaysesCard/RequestAnlaysesCard';
import { StarCheck, BookCheck } from 'lucide-react';

const RequestAnlayses = ({
  newRequests,
  acceptedRequests,
  totalRequests,
}: {
  newRequests: Request[];
  acceptedRequests: Request[];
  totalRequests: number;
}) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <RequestAnlaysesCard
        title="الريكويستات الجديدة"
        number={newRequests.length}
        icon={StarCheck}
      />
      <RequestAnlaysesCard
        title="الريكويستات المقبولة"
        number={acceptedRequests.length}
        icon={BookCheck}
      />
      <RequestAnlaysesCard
        title="إجمالي الريكويستات"
        number={totalRequests}
        icon={StarCheck}
      />
    </div>
  );
};

export default RequestAnlayses;
