import React from 'react';
import getAllUsers from '../../../../lib/Helper/getAllUsers';
import AllEmployee from '@/_Components/Admin_components/AllEmployee/AllEmployee';

const Employee = async () => {
  const users = await getAllUsers();

  return (
    <div className="flex flex-col gap-3 p-3">
      <section className="rounded-2xl border border-primary-100 bg-gradient-to-l from-primary-50 to-white p-5">
        <p className="text-13 font-semibold text-primary-600">إدارة الفريق</p>
        <h1 className="mt-1 text-24 font-bold text-secondary-950">
          دليل الموظفين
        </h1>
        <p className="mt-1 text-14 text-secondary-400">
          تابع حسابات الموظفين وأداء كل موظف وتحكم في حالة الحساب
        </p>
      </section>

      <AllEmployee users={users} />
    </div>
  );
};

export default Employee;
