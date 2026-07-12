import EditUser from '@/_Components/EditUser/EditUser';
import React from 'react';
import getCustomerById from '../../../../../../lib/Helper/getCustomerById';
import { RecentClient } from '@/interface';
import getClientDocs from '../../../../../../lib/Helper/getClientDocs';
import getClientDocumentsSignedUrls from '../../../../../../lib/Helper/getClientDocumentUrls';
import EditClientDocs from '@/_Components/EditClientDocs/EditClientDocs';
import getUserProfile from '../../../../../../lib/Helper/getUserProfile';

const EditCustomer = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const customer: RecentClient = await getCustomerById(id);
  const clientDocs = await getClientDocs(id);
  const data = await getClientDocumentsSignedUrls(clientDocs[0]);
  const user = await getUserProfile();
  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-24 font-bold text-secondary-900">
          تعديل بيانات العميل
        </h3>
        <p className="text-16 text-secondary-400 font-medium">
          يمكنك تعديل البيانات الأساسية الخاصة بالعميل ومراجعة تفاصيل الحجز.
        </p>
      </div>
      <EditUser customer={customer} />
      <EditClientDocs
        clientId={id}
        documentsUrls={data}
        employeeId={user.id}
        notes={clientDocs[0]?.notes}
      />
    </div>
  );
};

export default EditCustomer;
