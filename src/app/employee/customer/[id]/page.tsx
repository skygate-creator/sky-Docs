import getTripById from '../../../../../lib/Helper/getTripById';
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
  const [trip, user] = await Promise.all([
    getTripById(id),
    getUserProfile(),
  ]);

  if (!trip || !user) notFound();

  return (
    <section className="flex flex-col gap-5 p-3">
      <CustomerInfo client={trip.customer} trip={trip} />
      <ClientDocs
        customerId={trip.customer_id}
        tripId={trip.id}
        employeeId={user.id}
        hasPassport={Boolean(trip.customer.customer_files?.passport_path)}
      />
    </section>
  );
};

export default customerDetails;
