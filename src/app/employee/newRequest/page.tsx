import React from 'react';
import getEmployeeRequests from '../../../../lib/Helper/getEmployeeRequests';
import RequestsList from '@/_Components/RequestsList/RequestsList';

const newRequest = async () => {
  const request = await getEmployeeRequests();

  return (
    <section className="p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-24 font-bold text-secondary-900">طلبات العملاء</h2>

        <p className="text-16 font-medium text-secondary-400">
          جميع الطلبات الجديدة المرسلة إليك تظهر هنا بشكل مباشر
        </p>
      </div>

      <RequestsList Requests={request} />
    </section>
  );
};

export default newRequest;
