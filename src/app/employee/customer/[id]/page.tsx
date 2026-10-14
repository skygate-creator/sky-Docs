import getCustomerById from '../../../../../lib/Helper/getCustomerById';
import CustomerInfo from '@/_Components/CustomerInfo/CustomerInfo';
import ClientDocs from '@/_Components/ClientDocs/ClientDocs';
import getUserProfile from '../../../../../lib/Helper/getUserProfile';
import { notFound } from 'next/navigation';

const customerDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [customerDetails, user] = await Promise.all([
    getCustomerById(id),
    getUserProfile(),
  ]);

  if (!customerDetails || !user) notFound();

  return (
    <section className="flex flex-col gap-5 p-3">
      <CustomerInfo client={customerDetails} />
      <ClientDocs clientId={id} employeeId={user.id} />
    </section>
  );
};

export default customerDetails;
