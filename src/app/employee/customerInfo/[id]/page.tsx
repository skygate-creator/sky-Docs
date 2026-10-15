import CustomerFileView from '@/_Components/CustomerFileView/CustomerFileView';
import getCustomerById from '../../../../../lib/Helper/getCustomerById';
import { notFound } from 'next/navigation';

const CustomerInformationPage = async ({
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
      tripBaseHref={`/employee/customerInfo/${customer.id}`}
      backHref="/employee/customer"
      backLabel="العودة إلى العملاء"
      editBaseHref={`/employee/customer/EditCustomer/${customer.id}`}
    />
  );
};

export default CustomerInformationPage;
