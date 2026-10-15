import CustomerFileView from '@/_Components/CustomerFileView/CustomerFileView';
import getCustomerById from '../../../../../../lib/Helper/getCustomerById';
import { notFound } from 'next/navigation';

const ClientInfo = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ trip?: string }>;
}) => {
  const { id } = await params;
  const { trip } = await searchParams;
  const customer = await getCustomerById(id);

  if (!customer) notFound();

  return (
    <CustomerFileView
      customer={customer}
      requestedTripId={trip}
      tripBaseHref={`/admin/employee/clientInfo/${customer.id}`}
      backHref={`/admin/employee/${customer.employee_id}`}
      backLabel="العودة إلى ملف الموظف"
    />
  );
};

export default ClientInfo;
