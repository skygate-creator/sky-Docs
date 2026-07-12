import React from 'react';
import getUserById from '../../../../../lib/Helper/getUserById';
import getAllClients from '../../../../../lib/Helper/getAllClients';
import getUserClientsById from '../../../../../lib/Helper/getUserClientsById';
import EmployeeDetailsCard from '@/_Components/Admin_components/EmployeeDetailsCard/EmployeeDetailsCard';
import AllClintes from '@/_Components/AllClients/AllClients';
import AdminAllClintes from '@/_Components/Admin_components/AdminAllClients/AdminAllClients';

const employeeDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getUserById(id);
  const userClients = await getUserClientsById(id);
  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="title flex flex-col gap-2">
        <h2 className="text-24 font-bold text-primary-500">
          تفاصيل الموظفين والعملاء
        </h2>
        <p className="text-secondary-400 font-medium text-16">
          عرض ملف الموظف الشخصي وقائمة العملاء المرتبطين به
        </p>
      </div>
      <EmployeeDetailsCard user={user} userClientsLength={userClients.length} />
      <AdminAllClintes clients={userClients} />
    </div>
  );
};

export default employeeDetails;
