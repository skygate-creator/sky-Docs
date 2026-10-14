import EditUser from '@/_Components/EditUser/EditUser';
import getCustomerById from '../../../../../../lib/Helper/getCustomerById';
import getClientDocs from '../../../../../../lib/Helper/getClientDocs';
import getClientDocumentsSignedUrls from '../../../../../../lib/Helper/getClientDocumentUrls';
import EditClientDocs from '@/_Components/EditClientDocs/EditClientDocs';
import getUserProfile from '../../../../../../lib/Helper/getUserProfile';
import Link from 'next/link';
import { ArrowRight, UserRoundPen } from 'lucide-react';
import { notFound } from 'next/navigation';

const EditCustomer = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [customer, clientDocs, user] = await Promise.all([
    getCustomerById(id),
    getClientDocs(id),
    getUserProfile(),
  ]);

  if (!customer || !user) notFound();
  const data = await getClientDocumentsSignedUrls(clientDocs[0]);

  return (
    <div className="flex w-full flex-col gap-6 p-3">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/employee/customer"
            className="mb-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#cbd7e4] bg-white px-4 text-12 font-semibold text-secondary-600 transition-colors hover:border-primary-300 hover:text-primary-600"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى العملاء
          </Link>
          <h1 className="text-28 font-bold text-secondary-950">
            تعديل بيانات العميل
          </h1>
          <p className="mt-1 text-13 font-medium text-secondary-400">
            حدّث البيانات الأساسية والمستندات الخاصة بالرحلة.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-[16px] border border-[#d4dfeb] bg-[#e8eef5] px-4 py-3 sm:min-w-64">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-white text-primary-500">
            <UserRoundPen className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <span className="block text-11 text-secondary-400">
              يتم تعديل ملف
            </span>
            <strong className="block truncate text-14 text-secondary-950">
              {customer.customer_name}
            </strong>
          </div>
        </div>
      </header>

      <EditUser customer={customer} />
      <EditClientDocs
        clientId={id}
        documentsUrls={data}
        documentPaths={clientDocs[0] ?? null}
        employeeId={user.id}
        notes={clientDocs[0]?.notes}
      />
    </div>
  );
};

export default EditCustomer;
