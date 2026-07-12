import React from 'react';
import getCustomerById from '../../../../../lib/Helper/getCustomerById';
import { ClientDetails } from '@/interface';
import CustomerInfo from '@/_Components/CustomerInfo/CustomerInfo';
import ClientDocs from '@/_Components/ClientDocs/ClientDocs';
import getUserProfile from '../../../../../lib/Helper/getUserProfile';

const customerDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const customerDetails: ClientDetails = await getCustomerById(id);
  const user = await getUserProfile();
  return (
    <section className="flex flex-col gap-5 p-5">
      <CustomerInfo client={customerDetails} />
      <ClientDocs clientId={id} employeeId={user.id} />
    </section>
  );
};

export default customerDetails;
