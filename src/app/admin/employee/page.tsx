import React, { Suspense } from 'react';
import getAllUsers from '../../../../lib/Helper/getAllUsers';
import EmployeeCard from '@/_Components/Admin_components/EmployeeCard/EmployeeCard';
import AllEmployee from '@/_Components/Admin_components/AllEmployee/AllEmployee';
import { RecentClient } from '@/interface';

const Employee = async () => {
  const users = await getAllUsers();

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="title flex flex-col gap-2">
        <h2 className="text-24 font-bold text-primary-500">الموظفين</h2>
        <p className="text-secondary-400 font-medium text-16">
          استعرض جميع الموظفين وابحث عن أي موظف بسهولة
        </p>
      </div>
      <Suspense fallback={<span className="loader"></span>}>
        <AllEmployee users={users} />
      </Suspense>
    </div>
  );
};

export default Employee;
