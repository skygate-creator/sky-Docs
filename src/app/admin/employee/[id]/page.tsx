import React from 'react';
import getUserById from '../../../../../lib/Helper/getUserById';
import getUserClientsById from '../../../../../lib/Helper/getUserClientsById';
import EmployeeDetailsCard from '@/_Components/Admin_components/EmployeeDetailsCard/EmployeeDetailsCard';
import EmployeeWorkspace from '@/_Components/Admin_components/EmployeeWorkspace/EmployeeWorkspace';
import getEmployeeRequestsById from '../../../../../lib/Helper/getEmployeeRequestsById';
import { notFound } from 'next/navigation';

const employeeDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [user, userClients, employeeRequests] = await Promise.all([
    getUserById(id),
    getUserClientsById(id),
    getEmployeeRequestsById(id),
  ]);

  if (!user) notFound();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  ).getTime();
  const monthlyRequests = employeeRequests.filter((request) => {
    const createdAt = new Date(request.created_at ?? 0).getTime();
    return createdAt >= startOfMonth && createdAt < startOfNextMonth;
  }).length;
  const totalsByCurrency = userClients.reduce<Record<string, number>>(
    (totals, client) => {
      const currency = client.currency || 'SAR';
      totals[currency] = (totals[currency] ?? 0) + Number(client.trip_price || 0);
      return totals;
    },
    {},
  );
  const latestActivityAt = [
    ...userClients.map((client) => client.created_at),
    ...employeeRequests.map((request) => request.created_at),
  ]
    .filter((date): date is string => Boolean(date))
    .sort((first, second) =>
      second.localeCompare(first),
    )[0];

  return (
    <div className="flex flex-col gap-3 p-3">
      <EmployeeDetailsCard
        user={user}
        clientsCount={userClients.length}
        monthlyRequests={monthlyRequests}
        totalRequests={employeeRequests.length}
        totalsByCurrency={totalsByCurrency}
        latestActivityAt={latestActivityAt}
      />
      <EmployeeWorkspace clients={userClients} requests={employeeRequests} />
    </div>
  );
};

export default employeeDetails;
