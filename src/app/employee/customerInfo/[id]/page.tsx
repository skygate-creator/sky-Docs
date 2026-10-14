import getCustomerById from '../../../../../lib/Helper/getCustomerById';
import CustomerInfo from '@/_Components/CustomerInfo/CustomerInfo';
import getClientDocs from '../../../../../lib/Helper/getClientDocs';
import getClientDocumentsSignedUrls from '../../../../../lib/Helper/getClientDocumentUrls';
import ReadFileCard from '@/_Components/ReadFileCard/ReadFileCard';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Bus,
  Car,
  Hotel,
  MessageSquareText,
  Plane,
  PlaneTakeoff,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const CustomerInformationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const [customerDetails, clientDocs] = await Promise.all([
    getCustomerById(id),
    getClientDocs(id),
  ]);

  if (!customerDetails) notFound();
  const documentUrls = await getClientDocumentsSignedUrls(clientDocs[0]);
  const documentsCount = Object.values(documentUrls).filter(Boolean).length;

  const documents = [
    {
      name: 'تذكرة الطيران الدولي',
      fileName: 'تذكرة الطيران الدولي',
      fileUrl: documentUrls.flight_path,
      icon: <Plane className="h-5 w-5" />,
    },
    {
      name: 'تذكرة الطيران الداخلي',
      fileName: 'تذكرة الطيران الداخلي',
      fileUrl: documentUrls.inside_flight_path,
      icon: <PlaneTakeoff className="h-5 w-5" />,
    },
    {
      name: 'قسيمة الفندق',
      fileName: 'قسيمة الفندق',
      fileUrl: documentUrls.voucher_path,
      icon: <Hotel className="h-5 w-5" />,
    },
    {
      name: 'حجز السيارة',
      fileName: 'حجز السيارة',
      fileUrl: documentUrls.car_path,
      icon: <Car className="h-5 w-5" />,
    },
    {
      name: 'الباقة السياحية',
      fileName: 'الباقة السياحية',
      fileUrl: documentUrls.package_path,
      icon: <BriefcaseBusiness className="h-5 w-5" />,
    },
    {
      name: 'جواز السفر',
      fileName: 'جواز السفر',
      fileUrl: documentUrls.passport_path,
      icon: <BadgeCheck className="h-5 w-5" />,
    },
    {
      name: 'بيانات المورد',
      fileName: 'بيانات المورد',
      fileUrl: documentUrls.supplier_info_path,
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      name: 'تحويلات العملاء',
      fileName: 'تحويلات العملاء',
      fileUrl: documentUrls.customer_transfers_path,
      icon: <Bus className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 p-3">
      <header>
        <Link
          href="/employee/customer"
          className="mb-2 inline-flex min-h-10 items-center gap-2 text-12 font-semibold text-secondary-500 transition-colors hover:text-primary-600"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى العملاء
        </Link>
        <h1 className="text-28 font-bold text-secondary-950">ملف العميل</h1>
        <p className="mt-1 text-13 font-medium text-secondary-400">
          راجع بيانات العميل ومستندات الرحلة من مكان واحد.
        </p>
      </header>

      <CustomerInfo
        client={customerDetails}
        documentsCount={documentsCount}
        editHref={`/employee/customer/EditCustomer/${customerDetails.id}`}
      />

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-18 font-bold text-secondary-950">
              المستندات والوثائق
            </h2>
            <p className="mt-1 text-11 text-secondary-400">
              يمكنك معاينة الملفات المرفقة أو تحميلها.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-11 font-semibold text-secondary-500">
            {documentsCount} ملفات مرفقة
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {documents.map((document) => (
            <ReadFileCard key={document.name} {...document} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-[auto_1fr] gap-3 rounded-[18px] border border-[#d4dfeb] bg-[#e8eef5] p-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-primary-500">
          <MessageSquareText className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-14 font-bold text-secondary-950">
            ملاحظات العميل
          </h2>
          <p className="mt-1 text-12 leading-7 text-secondary-600">
            {clientDocs[0]?.notes?.trim() || 'لا توجد ملاحظات مضافة لهذا العميل.'}
          </p>
        </div>
      </section>
    </div>
  );
};

export default CustomerInformationPage;
