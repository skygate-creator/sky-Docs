import DispatcherAddRequest from '@/Utils/DispatcherAddRequest';

import getUsersToDispatcher from '../../../../lib/Helper/getUsersToDispatcher';

const newRequest = async () => {
  const users = await getUsersToDispatcher(); // [{ id, name }, ...]

  const usersOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <section className="p-5 flex flex-col gap-5">
      <div className="title flex flex-col gap-2">
        <h2 className="text-24 font-bold text-primary-500">
          لوحة إدارة الريكويستات
        </h2>
        <p className="text-secondary-400 font-medium text-16">
          إرسل طلبات العملاء إلي موظفي المبيعات ومتابعة حالة الاستلام اللحظية
        </p>
      </div>
      <DispatcherAddRequest users={usersOptions} />
    </section>
  );
};

export default newRequest;
