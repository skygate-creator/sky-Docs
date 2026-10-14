import getEmployeeRequests from '../../../../lib/Helper/getEmployeeRequests';
import RequestsList from '@/_Components/RequestsList/RequestsList';
import { Request } from '@/interface';

const newRequest = async () => {
  const request: Request[] = await getEmployeeRequests();

  return (
    <section className="p-3">
      <RequestsList Requests={request} />
    </section>
  );
};

export default newRequest;
