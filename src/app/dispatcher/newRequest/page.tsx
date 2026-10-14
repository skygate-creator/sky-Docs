import DispatcherAddRequest from '@/Utils/DispatcherAddRequest';

import getUsersToDispatcher from '../../../../lib/Helper/getUsersToDispatcher';
import getDispatcherEmployeeRequestCounts from '../../../../lib/Helper/getDispatcherEmployeeRequestCounts';
import DispatcherEmployeeRequestsTable from '@/_Components/DispatcherEmployeeRequestsTable/DispatcherEmployeeRequestsTable';

const newRequest = async () => {
  const [users, employeeRequestCounts] = await Promise.all([
    getUsersToDispatcher(),
    getDispatcherEmployeeRequestCounts(),
  ]);

  const usersOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <section className="flex flex-col gap-5 p-3">
      <div className="title flex flex-col gap-2">
        <h2 className="text-24 font-bold text-primary-500">
          لوحة إدارة الريكويستات
        </h2>
        <p className="text-secondary-400 font-medium text-16">
          إرسل طلبات العملاء إلي موظفي المبيعات ومتابعة حالة الاستلام اللحظية
        </p>
      </div>
      <DispatcherAddRequest users={usersOptions} />
      <DispatcherEmployeeRequestsTable employees={employeeRequestCounts} />
    </section>
  );
};

export default newRequest;
