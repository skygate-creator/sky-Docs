import React from 'react';
import getEmployeeRequestsById from '../../../../../../lib/Helper/getEmployeeRequestsById';
import { Request } from '@/interface';
import getUserById from '../../../../../../lib/Helper/getUserById';
import RequestsTable from '@/_Components/Admin_components/RequestTable/RequesTable';

const employeeRequets = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getUserById(id);
  const employeeRequestsDetails: Request[] = await getEmployeeRequestsById(id);

  return (
    <section className="flex flex-col gap-5 p-5">
      <div className="title flex flex-col gap-2">
        <h2 className="text-24 font-bold text-primary-500">
          تفاصيل الريكويستات الخاصة بالموظف {user.name}
        </h2>
        <p className="text-secondary-400 font-medium text-16">
          عرض ملف الموظف الشخصي وقائمة العملاء المرتبطين به
        </p>
      </div>
      <RequestsTable requests={employeeRequestsDetails} />
    </section>
  );
};

export default employeeRequets;
